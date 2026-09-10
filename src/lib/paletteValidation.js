/**
 * Palette validation, sanitization, and non-destructive merge utilities.
 */

/**
 * Validates and normalizes a hex color string.
 * Supports #RGB and #RRGGBB.
 * Returns normalized uppercase #RRGGBB or null if invalid.
 */
export function sanitizeHex(hex) {
  if (typeof hex !== 'string') return null;
  const trimmed = hex.trim();
  const match = trimmed.match(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/);
  if (!match) return null;

  const hexVal = match[1];
  if (hexVal.length === 3) {
    const r = hexVal[0];
    const g = hexVal[1];
    const b = hexVal[2];
    return `#${r}${r}${g}${g}${b}${b}`.toUpperCase();
  }
  return `#${hexVal}`.toUpperCase();
}

/**
 * Validates an entire palette array.
 * Must be an array of 3 to 8 valid hex strings (typically 5).
 * Returns array of normalized hex strings or null if invalid.
 */
export function validatePalette(palette) {
  if (!Array.isArray(palette)) return null;
  if (palette.length < 3 || palette.length > 8) return null;

  const sanitized = [];
  for (const color of palette) {
    const s = sanitizeHex(color);
    if (!s) return null;
    sanitized.push(s);
  }
  return sanitized;
}

/**
 * Validates colorOrder permutation.
 * Must be null, undefined, or an array of distinct integers from 0 to length - 1.
 * Returns validated array, null, or false if invalid.
 */
export function validateColorOrder(colorOrder, paletteLength) {
  if (colorOrder === null || colorOrder === undefined) return null;
  if (!Array.isArray(colorOrder)) return false;
  if (colorOrder.length !== paletteLength) return false;

  const seen = new Set();
  for (const idx of colorOrder) {
    if (typeof idx !== 'number' || !Number.isInteger(idx)) return false;
    if (idx < 0 || idx >= paletteLength) return false;
    if (seen.has(idx)) return false;
    seen.add(idx);
  }
  return colorOrder;
}

/**
 * Validates activeColor against the palette.
 * Returns normalized hex if valid, or fallback if invalid/missing.
 */
export function validateActiveColor(activeColor, palette) {
  if (!activeColor) return palette[0];
  const s = sanitizeHex(activeColor);
  if (!s) return palette[0];
  // Must exist within the palette
  if (!palette.includes(s)) return palette[0];
  return s;
}

/**
 * Non-destructive merge of palette updates into brand_data.
 * Strictly preserves all unrelated fields (resultadoFinal, logo, brandElement, etc.)
 */
export function mergePaletteIntoBrandData(existingBrandData, paletteUpdate) {
  const current = (typeof existingBrandData === 'string'
    ? (() => { try { return JSON.parse(existingBrandData); } catch { return {}; } })()
    : existingBrandData) || {};

  // 1. Validate palette
  const sanitizedPalette = validatePalette(paletteUpdate.currentPaletteColors);
  if (!sanitizedPalette) {
    throw new Error('Paleta de cores inválida.');
  }

  // 2. Validate colorOrder
  const validatedOrder = validateColorOrder(paletteUpdate.colorOrder, sanitizedPalette.length);
  if (validatedOrder === false) {
    throw new Error('Ordem de cores inválida.');
  }

  // 3. Validate activeColor
  const validatedActiveColor = validateActiveColor(paletteUpdate.activeColor, sanitizedPalette);

  // 4. Merge only whitelisted fields into brand_data
  const merged = {
    ...current,
    currentPaletteColors: sanitizedPalette,
    colorOrder: validatedOrder,
    activeColor: validatedActiveColor,
    editData: {
      ...(current.editData || {}),
      colors: sanitizedPalette,
    },
  };

  return merged;
}

/**
 * Strict verification that a delivery record has confirmed, completed payment.
 * Fails closed: rejects missing, unpaid, pending, failed, or superseded records.
 * Authorizes:
 * - Records explicitly confirmed as paid by Stripe (payment_status in ['paid', 'complete', 'completed', 'succeeded'] and paid === true)
 * - Legitimate older completed deliveries created prior to the payment_status column where paid === true
 */
export function isExplicitlyPaid(delivery) {
  if (!delivery || typeof delivery !== 'object') return false;
  // 1. O registro DEVE ter paid === true comprovado no banco
  if (delivery.paid !== true) return false;

  const status = (delivery.payment_status || '').toLowerCase().trim();

  // 2. Status explicitamente não-pagos, falhos, pendentes ou cancelados NUNCA são autorizados
  const nonPaidStatuses = ['failed', 'unpaid', 'pending', 'superseded', 'abandoned'];
  if (nonPaidStatuses.includes(status)) return false;

  // 3. Status confirmados e explícitos
  const validPaidStatuses = ['paid', 'complete', 'completed', 'succeeded'];
  if (validPaidStatuses.includes(status)) return true;

  // 4. Entregas legadas concluídas anteriores à coluna payment_status (onde paid === true)
  if (!status) return true;

  return false;
}

/**
 * Verifies that the supplied access credential authorizes access to the given delivery.
 * Enforces:
 * 1. Delivery existence (404)
 * 2. Presence of access credential (401)
 * 3. Confirmed payment status (402)
 * 4. High-entropy credential match against delivery's unforgeable credentials (403)
 */
export function verifyDeliveryAuthorization(delivery, accessCredential) {
  if (!delivery) {
    return { authorized: false, status: 404, error: 'Entrega não encontrada.' };
  }

  if (!accessCredential || typeof accessCredential !== 'string' || !accessCredential.trim()) {
    return { authorized: false, status: 401, error: 'Credencial de acesso ausente ou não fornecida.' };
  }

  if (!isExplicitlyPaid(delivery)) {
    return {
      authorized: false,
      status: 402,
      error: 'Acesso não autorizado ou pagamento pendente/não confirmado.',
      payment_status: delivery.payment_status || 'unconfirmed',
    };
  }

  const cleanCred = accessCredential.trim();
  const validCredentials = new Set();
  if (delivery.id) validCredentials.add(String(delivery.id).trim());
  if (delivery.stripe_session_id) validCredentials.add(String(delivery.stripe_session_id).trim());
  if (delivery.brand_data?.access_token) validCredentials.add(String(delivery.brand_data.access_token).trim());
  if (delivery.access_token) validCredentials.add(String(delivery.access_token).trim());

  if (!validCredentials.has(cleanCred)) {
    return {
      authorized: false,
      status: 403,
      error: 'Credencial de acesso inválida para esta entrega.',
    };
  }

  return { authorized: true };
}
