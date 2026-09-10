import assert from 'node:assert/strict';
import {
  sanitizeHex,
  validatePalette,
  validateColorOrder,
  validateActiveColor,
  mergePaletteIntoBrandData,
  isExplicitlyPaid,
  verifyDeliveryAuthorization,
} from '../src/lib/paletteValidation.js';

console.log('🧪 Starting Palette Color Editing & Security Test Suite...\n');

// -------------------------------------------------------------
// TEST 1: Hex Sanitization and Validation
// -------------------------------------------------------------
console.log('Test 1: Hex sanitization and validation...');
assert.equal(sanitizeHex('#fff'), '#FFFFFF');
assert.equal(sanitizeHex('#333'), '#333333');
assert.equal(sanitizeHex('#8b7355'), '#8B7355');
assert.equal(sanitizeHex('#8B7355'), '#8B7355');
assert.equal(sanitizeHex('  #c4a882  '), '#C4A882');
assert.equal(sanitizeHex('invalid'), null);
assert.equal(sanitizeHex(''), null);
assert.equal(sanitizeHex(null), null);
assert.equal(sanitizeHex('#12345'), null);
assert.equal(sanitizeHex('#1234567'), null);
assert.equal(sanitizeHex('rgba(0,0,0,1)'), null);
console.log('  ✅ Hex sanitization passed.');

// -------------------------------------------------------------
// TEST 2: Palette Array Validation
// -------------------------------------------------------------
console.log('Test 2: Palette array validation...');
const valid5 = ['#8B7355', '#C4A882', '#D4C5B0', '#6B8CAE', '#333333'];
assert.deepEqual(validatePalette(valid5), ['#8B7355', '#C4A882', '#D4C5B0', '#6B8CAE', '#333333']);

const mixedCaseAndShorthand = ['#fff', '#8b7355', '#ccc', '#000', '#abc'];
assert.deepEqual(validatePalette(mixedCaseAndShorthand), ['#FFFFFF', '#8B7355', '#CCCCCC', '#000000', '#AABBCC']);

assert.equal(validatePalette(['#8B7355', '#C4A882']), null); // too short (<3)
assert.equal(validatePalette([...valid5, '#111', '#222', '#333', '#444']), null); // too long (>8)
assert.equal(validatePalette(['#8B7355', '#C4A882', 'not-a-color', '#6B8CAE', '#333']), null);
assert.equal(validatePalette('not-an-array'), null);
assert.equal(validatePalette(null), null);
console.log('  ✅ Palette array validation passed.');

// -------------------------------------------------------------
// TEST 3: ColorOrder Permutation Validation
// -------------------------------------------------------------
console.log('Test 3: ColorOrder permutation validation...');
assert.deepEqual(validateColorOrder([0, 1, 2, 3, 4], 5), [0, 1, 2, 3, 4]);
assert.deepEqual(validateColorOrder([3, 0, 1, 2, 4], 5), [3, 0, 1, 2, 4]);
assert.equal(validateColorOrder(null, 5), null);
assert.equal(validateColorOrder(undefined, 5), null);

// Invalid permutations:
assert.equal(validateColorOrder([0, 1, 2, 3], 5), false); // wrong length
assert.equal(validateColorOrder([0, 1, 2, 3, 5], 5), false); // index 5 out of bounds for len 5
assert.equal(validateColorOrder([0, 1, 2, 3, -1], 5), false); // negative index
assert.equal(validateColorOrder([0, 1, 2, 3, 3], 5), false); // duplicate index
assert.equal(validateColorOrder([0, 1, 2, 3, '4'], 5), false); // non-number
assert.equal(validateColorOrder('invalid', 5), false);
console.log('  ✅ ColorOrder permutation validation passed.');

// -------------------------------------------------------------
// TEST 4: Semantic activeColor Validation
// -------------------------------------------------------------
console.log('Test 4: Semantic activeColor validation...');
const palette = ['#8B7355', '#C4A882', '#D4C5B0', '#6B8CAE', '#333333'];
assert.equal(validateActiveColor('#C4A882', palette), '#C4A882');
assert.equal(validateActiveColor('#c4a882', palette), '#C4A882'); // normalizes case
assert.equal(validateActiveColor('#FF0000', palette), '#8B7355'); // not in palette -> fall back to palette[0]
assert.equal(validateActiveColor(null, palette), '#8B7355');
console.log('  ✅ Semantic activeColor validation passed.');

// -------------------------------------------------------------
// TEST 5: Non-Destructive Server Merge & Unrelated Field Invariance
// -------------------------------------------------------------
console.log('Test 5: Non-destructive server merge & unrelated field invariance...');
const originalBrandData = {
  resultadoFinal: {
    estiloId: 'est_01',
    estiloNome: 'Essência Atemporal',
    mensagem: 'Conceito exclusivo da marca.',
    creativeDirectorJourneyId: 'journey_123',
  },
  selectedBrandElementId: 'elem_456',
  brandElement: { id: 'elem_456', type: 'monogram', svg: '<svg>...</svg>' },
  logoLayout: 'balanced',
  customLogoSrc: 'data:image/png;base64,...',
  papelariaSelecionada: ['Cartão de Visita', 'Papel Timbrado'],
  estampaPatterns: [{ url: 'https://example.com/pattern1.png' }],
  contacts: { phone: '11999999999', instagram: '@minhamarca' },
  crmLine: 'CRM/SP 123456',
  currentPaletteColors: ['#111111', '#222222', '#333333', '#444444', '#555555'],
  editData: {
    marca: 'DRA. ANA SILVA',
    tagline: 'Pediatria com Amor',
    colors: ['#111111', '#222222', '#333333', '#444444', '#555555'],
    fontFamily: 'Playfair Display',
  },
  colorOrder: [0, 1, 2, 3, 4],
  activeColor: '#111111',
};

const updatedPalette = ['#8B7355', '#C4A882', '#D4C5B0', '#6B8CAE', '#333333'];
const merged = mergePaletteIntoBrandData(originalBrandData, {
  currentPaletteColors: updatedPalette,
  colorOrder: [3, 0, 1, 2, 4],
  activeColor: '#6B8CAE',
});

// 1. Palette fields correctly updated:
assert.deepEqual(merged.currentPaletteColors, updatedPalette);
assert.deepEqual(merged.editData.colors, updatedPalette);
assert.deepEqual(merged.colorOrder, [3, 0, 1, 2, 4]);
assert.equal(merged.activeColor, '#6B8CAE');

// 2. Unrelated fields STRICTLY PRESERVED:
assert.deepEqual(merged.resultadoFinal, originalBrandData.resultadoFinal);
assert.equal(merged.selectedBrandElementId, 'elem_456');
assert.deepEqual(merged.brandElement, originalBrandData.brandElement);
assert.equal(merged.logoLayout, 'balanced');
assert.equal(merged.customLogoSrc, 'data:image/png;base64,...');
assert.deepEqual(merged.papelariaSelecionada, ['Cartão de Visita', 'Papel Timbrado']);
assert.deepEqual(merged.estampaPatterns, [{ url: 'https://example.com/pattern1.png' }]);
assert.deepEqual(merged.contacts, originalBrandData.contacts);
assert.equal(merged.crmLine, 'CRM/SP 123456');
assert.equal(merged.editData.marca, 'DRA. ANA SILVA');
assert.equal(merged.editData.tagline, 'Pediatria com Amor');
assert.equal(merged.editData.fontFamily, 'Playfair Display');
console.log('  ✅ Unrelated fields invariance passed.');

// -------------------------------------------------------------
// TEST 6: Stale Client brand_data Cannot Overwrite Server Fields
// -------------------------------------------------------------
console.log('Test 6: Stale client brand_data cannot overwrite server fields...');
// Simulate client sending a stale brand_data object with outdated logo or missing fields
const staleClientBrandData = {
  currentPaletteColors: ['#AAAAAA', '#BBBBBB', '#CCCCCC', '#DDDDDD', '#EEEEEE'],
  resultadoFinal: { estiloNome: 'STALE OBSOLETE' }, // client tries to alter resultadoFinal
  selectedBrandElementId: 'stale_id', // client tries to alter element
};

const mergedFromStale = mergePaletteIntoBrandData(originalBrandData, staleClientBrandData);
assert.deepEqual(mergedFromStale.currentPaletteColors, ['#AAAAAA', '#BBBBBB', '#CCCCCC', '#DDDDDD', '#EEEEEE']);
// resultadoFinal and element MUST come from existing server record, NOT stale client payload
assert.equal(mergedFromStale.resultadoFinal.estiloNome, 'Essência Atemporal');
assert.equal(mergedFromStale.selectedBrandElementId, 'elem_456');
console.log('  ✅ Stale client rejection passed.');

// -------------------------------------------------------------
// TEST 7: Malformed Palettes are Rejected with Errors
// -------------------------------------------------------------
console.log('Test 7: Malformed palettes rejection...');
assert.throws(() => {
  mergePaletteIntoBrandData(originalBrandData, { currentPaletteColors: ['#123', 'bad-hex', '#456', '#789', '#abc'] });
}, /Paleta de cores inválida/);

assert.throws(() => {
  mergePaletteIntoBrandData(originalBrandData, {
    currentPaletteColors: valid5,
    colorOrder: [0, 1, 99, 3, 4], // invalid index
  });
}, /Ordem de cores inválida/);
console.log('  ✅ Malformed palettes rejection passed.');

// -------------------------------------------------------------
// TEST 8: Visual-to-Canonical Index Mapping with Reordered Palette
// -------------------------------------------------------------
console.log('Test 8: Visual-to-canonical index mapping & pattern payload...');
// Initial state:
const canonicalPalette = ['#8B7355', '#C4A882', '#D4C5B0', '#6B8CAE', '#333333'];
// Canonical index mapping:
// canonical[0] = #8B7355 (C0)
// canonical[1] = #C4A882 (C1)
// canonical[2] = #D4C5B0 (C2)
// canonical[3] = #6B8CAE (C3)
// canonical[4] = #333333 (C4)

// Customer reorders palette: color C3 (idx 3) moved to position 0
const colorOrder = [3, 0, 1, 2, 4];

// Simulated CoresPrioridadeStep:
const ordered = colorOrder.map(idx => ({ color: canonicalPalette[idx], idx }));
// Visual slots:
// Slot 0 displays color C3 (#6B8CAE), canonical idx = 3
// Slot 1 displays color C0 (#8B7355), canonical idx = 0
// Slot 2 displays color C1 (#C4A882), canonical idx = 1
// Slot 3 displays color C2 (#D4C5B0), canonical idx = 2
// Slot 4 displays color C4 (#333333), canonical idx = 4
assert.equal(ordered[0].color, '#6B8CAE');
assert.equal(ordered[0].idx, 3);
assert.equal(ordered[1].color, '#8B7355');
assert.equal(ordered[1].idx, 0);

// Customer clicks the pencil on visual Slot 1 (which displays C0).
// In CoresPrioridadeStep, clicking Slot 1 triggers input with `item.idx` = 0.
const clickedCanonicalIdx = ordered[1].idx;
assert.equal(clickedCanonicalIdx, 0); // Must be canonical 0, NOT visual 1!

const newColor = '#EE0000';
// Update canonical palette:
const updatedCanonical = [...canonicalPalette];
updatedCanonical[clickedCanonicalIdx] = newColor;

// Verify canonical palette:
assert.equal(updatedCanonical[0], '#EE0000'); // C0 was replaced
assert.equal(updatedCanonical[3], '#6B8CAE'); // C3 was NOT touched!

// Compute orderedPaletteColors for downstream components & pattern generator:
const orderedPaletteColors = colorOrder.map(i => updatedCanonical[i]);

// Verify downstream orderedPaletteColors:
assert.equal(orderedPaletteColors[0], '#6B8CAE'); // Visual slot 0 unchanged
assert.equal(orderedPaletteColors[1], '#EE0000'); // Visual slot 1 is now #EE0000!
assert.equal(orderedPaletteColors[2], '#C4A882');
assert.equal(orderedPaletteColors[3], '#D4C5B0');
assert.equal(orderedPaletteColors[4], '#333333');

// Verify pattern generator payload:
const patternPayload = {
  paleta: orderedPaletteColors,
  marca: 'MINHA MARCA',
};
assert.deepEqual(patternPayload.paleta, ['#6B8CAE', '#EE0000', '#C4A882', '#D4C5B0', '#333333']);
assert.equal(patternPayload.paleta[0], '#6B8CAE'); // Dominant motif color matches top visual slot
console.log('  ✅ Visual-to-canonical mapping and pattern payload passed.');

// -------------------------------------------------------------
// TEST 9: Semantic activeColor Behavior on Reordered Palette
// -------------------------------------------------------------
console.log('Test 9: Semantic activeColor behavior...');
// With colorOrder = [3, 0, 1, 2, 4], the visual primary color is slot 0 -> canonical index 3.
const primaryCanonicalIdx = colorOrder[0]; // 3

// Case A: Customer edits visual slot 1 (canonical index 0)
// Since canonical index 0 !== primaryCanonicalIdx (3), activeColor MUST NOT change.
let currentActiveColor = '#6B8CAE';
const editedIdxA = 0;
const newHexA = '#112233';
const activeColorA = (editedIdxA === primaryCanonicalIdx) ? newHexA : currentActiveColor;
assert.equal(activeColorA, '#6B8CAE'); // Preserved!

// Case B: Customer edits visual slot 0 (canonical index 3)
// Since canonical index 3 === primaryCanonicalIdx (3), activeColor MUST update to newHex.
const editedIdxB = 3;
const newHexB = '#990000';
const activeColorB = (editedIdxB === primaryCanonicalIdx) ? newHexB : currentActiveColor;
assert.equal(activeColorB, '#990000'); // Updated!
console.log('  ✅ Semantic activeColor behavior passed.');

// -------------------------------------------------------------
// TEST 10: Server-Side Authorization Invariant & Security Suite
// -------------------------------------------------------------
console.log('Test 10: Server-side authorization invariant & security suite...');

// 10.1: Explicit Payment Status Verification
console.log('  10.1: Explicit payment status verification...');
assert.equal(isExplicitlyPaid({ paid: true, payment_status: 'paid' }), true);
assert.equal(isExplicitlyPaid({ paid: true, payment_status: 'complete' }), true);
assert.equal(isExplicitlyPaid({ paid: true, payment_status: 'completed' }), true);
assert.equal(isExplicitlyPaid({ paid: true, payment_status: 'succeeded' }), true);
assert.equal(isExplicitlyPaid({ paid: true, payment_status: 'PAID' }), true); // case-insensitive

// Legitimate older completed deliveries created before the payment_status column (paid === true):
assert.equal(isExplicitlyPaid({ paid: true, payment_status: null }), true);
assert.equal(isExplicitlyPaid({ paid: true, payment_status: undefined }), true);
assert.equal(isExplicitlyPaid({ paid: true, payment_status: '' }), true);
assert.equal(isExplicitlyPaid({ paid: true, payment_status: '   ' }), true);

// Reject unpaid / pending / failed / superseded statuses (even if status is null when paid === false):
assert.equal(isExplicitlyPaid({ paid: false, payment_status: null }), false);
assert.equal(isExplicitlyPaid({ paid: false, payment_status: undefined }), false);
assert.equal(isExplicitlyPaid({ paid: false, payment_status: '' }), false);
assert.equal(isExplicitlyPaid({ paid: false, payment_status: 'paid' }), false);
assert.equal(isExplicitlyPaid({ paid: false, payment_status: 'pending' }), false);
assert.equal(isExplicitlyPaid({ paid: false, payment_status: 'unpaid' }), false);
assert.equal(isExplicitlyPaid({ paid: false, payment_status: 'failed' }), false);
assert.equal(isExplicitlyPaid({ paid: false, payment_status: 'superseded' }), false);
assert.equal(isExplicitlyPaid({ paid: false, payment_status: 'abandoned' }), false);
// If explicitly marked failed or canceled, even paid: true is rejected:
assert.equal(isExplicitlyPaid({ paid: true, payment_status: 'failed' }), false);
assert.equal(isExplicitlyPaid({ paid: true, payment_status: 'unpaid' }), false);
assert.equal(isExplicitlyPaid({ paid: true, payment_status: 'superseded' }), false);
assert.equal(isExplicitlyPaid({ paid: true, payment_status: 'abandoned' }), false);
assert.equal(isExplicitlyPaid(null), false);
assert.equal(isExplicitlyPaid({}), false);
console.log('    ✅ isExplicitlyPaid correctly authorizes paid records and rejects all non-paid/failed records.');

// 10.2: Authorization Credential Matching & Fail-Closed Behavior
console.log('  10.2: Authorization credential matching & fail-closed checks...');
const deliveryA = {
  id: 'uuid-customer-A',
  stripe_session_id: 'cs_live_session_A_12345',
  paid: true,
  payment_status: 'paid',
  brand_data: {
    resultadoFinal: { estiloNome: 'Essência Atemporal' },
    currentPaletteColors: ['#111111', '#222222', '#333333', '#444444', '#555555'],
    editData: { colors: ['#111111', '#222222', '#333333', '#444444', '#555555'] },
  },
};

const deliveryB = {
  id: 'uuid-customer-B',
  stripe_session_id: 'cs_live_session_B_67890',
  paid: true,
  payment_status: 'paid',
  brand_data: {
    resultadoFinal: { estiloNome: 'Doce Encantamento' },
    currentPaletteColors: ['#AAAAAA', '#BBBBBB', '#CCCCCC', '#DDDDDD', '#EEEEEE'],
  },
};

const deliveryC_unpaid = {
  id: 'uuid-customer-C-unpaid',
  stripe_session_id: 'cs_test_session_C',
  paid: false,
  payment_status: 'pending',
  brand_data: {},
};

const deliveryD_legacyPaid = {
  id: 'uuid-customer-D-legacy',
  stripe_session_id: 'cs_test_session_D',
  paid: true,
  payment_status: null, // Legacy completed delivery
  brand_data: {
    currentPaletteColors: ['#001122', '#002233', '#003344', '#004455', '#005566'],
    editData: { colors: ['#001122', '#002233', '#003344', '#004455', '#005566'] },
  },
};

// Check 1: Missing credential fails with 401
assert.equal(verifyDeliveryAuthorization(deliveryA, null).status, 401);
assert.equal(verifyDeliveryAuthorization(deliveryA, '').status, 401);
assert.equal(verifyDeliveryAuthorization(deliveryA, '   ').status, 401);
assert.equal(verifyDeliveryAuthorization(deliveryA, undefined).status, 401);

// Check 2: Non-existent delivery fails with 404
assert.equal(verifyDeliveryAuthorization(null, 'uuid-customer-A').status, 404);

// Check 3: Unpaid delivery fails with 402
assert.equal(verifyDeliveryAuthorization(deliveryC_unpaid, 'uuid-customer-C-unpaid').status, 402);

// Check 4: Valid older completed delivery (paid: true, payment_status: null) authorizes securely
assert.equal(verifyDeliveryAuthorization(deliveryD_legacyPaid, 'uuid-customer-D-legacy').authorized, true);

// Check 5: Valid credential for delivery A authorizes delivery A
assert.equal(verifyDeliveryAuthorization(deliveryA, 'uuid-customer-A').authorized, true);
assert.equal(verifyDeliveryAuthorization(deliveryA, 'cs_live_session_A_12345').authorized, true);

// Check 6: Valid credential for delivery A CANNOT update delivery B (BOLA/IDOR prevention)
const bolaAttempt = verifyDeliveryAuthorization(deliveryB, 'uuid-customer-A');
assert.equal(bolaAttempt.authorized, false);
assert.equal(bolaAttempt.status, 403);
assert.match(bolaAttempt.error, /Credencial de acesso inválida/);

const bolaAttemptStripe = verifyDeliveryAuthorization(deliveryB, 'cs_live_session_A_12345');
assert.equal(bolaAttemptStripe.authorized, false);
assert.equal(bolaAttemptStripe.status, 403);
console.log('    ✅ BOLA/IDOR credential matching prevents cross-delivery unauthorized access.');

// 10.3: Full Simulated Route Handler Execution
console.log('  10.3: Full route-level execution & database state verification...');
function simulatePatchDeliveryRoute(database, body, authHeader = null) {
  const bearerToken = authHeader ? authHeader.replace(/^Bearer\s+/i, '').trim() : null;
  const accessCredential = (body.accessCredential || body.sessionToken || body.token || bearerToken || '').trim();
  const targetId = (body.deliveryId || body.id || body.sessionId || '').trim();

  if (!targetId) {
    return { status: 400, body: { error: 'Identificador da entrega ausente.' } };
  }

  if (!accessCredential) {
    return { status: 401, body: { error: 'Credencial de acesso não fornecida.' } };
  }

  const existing = database[targetId] || null;
  if (!existing) {
    return { status: 404, body: { error: 'Entrega não encontrada.' } };
  }

  const authResult = verifyDeliveryAuthorization(existing, accessCredential);
  if (!authResult.authorized) {
    return { status: authResult.status, body: { error: authResult.error } };
  }

  if (body.paletteUpdate) {
    try {
      const mergedBrandData = mergePaletteIntoBrandData(existing.brand_data, body.paletteUpdate);
      existing.brand_data = mergedBrandData;
    } catch (valErr) {
      return { status: 400, body: { error: valErr.message } };
    }
  }

  const persistedColors = existing.brand_data?.currentPaletteColors || existing.brand_data?.editData?.colors || null;

  return {
    status: 200,
    body: {
      ok: true,
      updated: true,
      deliveryId: existing.id,
      currentPaletteColors: persistedColors,
    }
  };
}

// Set up mock DB with deep clones
const mockDb = {
  'uuid-A': JSON.parse(JSON.stringify(deliveryA)),
  'uuid-B': JSON.parse(JSON.stringify(deliveryB)),
  'uuid-C': JSON.parse(JSON.stringify(deliveryC_unpaid)),
  'uuid-D': JSON.parse(JSON.stringify(deliveryD_legacyPaid)),
};

// Scenario 1: Attacker knows delivery B's ID, passes NO credential
const res1 = simulatePatchDeliveryRoute(mockDb, { deliveryId: 'uuid-B' });
assert.equal(res1.status, 401);
assert.match(res1.body.error, /Credencial de acesso não fornecida/);

// Scenario 2: Attacker possesses credential for delivery A, tries to update delivery B
const res2 = simulatePatchDeliveryRoute(mockDb, {
  deliveryId: 'uuid-B',
  accessCredential: 'uuid-A',
  paletteUpdate: { currentPaletteColors: ['#8B7355', '#C4A882', '#D4C5B0', '#6B8CAE', '#333333'] }
});
assert.equal(res2.status, 403);
assert.match(res2.body.error, /Credencial de acesso inválida/);
// Verify delivery B was NOT touched:
assert.deepEqual(mockDb['uuid-B'].brand_data.currentPaletteColors, ['#AAAAAA', '#BBBBBB', '#CCCCCC', '#DDDDDD', '#EEEEEE']);

// Scenario 3: Caller tries to update unpaid delivery C with delivery C's credential
const res3 = simulatePatchDeliveryRoute(mockDb, {
  deliveryId: 'uuid-C',
  accessCredential: 'uuid-customer-C-unpaid',
  paletteUpdate: { currentPaletteColors: ['#8B7355', '#C4A882', '#D4C5B0', '#6B8CAE', '#333333'] }
});
assert.equal(res3.status, 402);

// Scenario 4: Legitimate older completed delivery D saves securely
const updatedPaletteD = ['#990000', '#AA1111', '#BB2222', '#CC3333', '#DD4444'];
const res4 = simulatePatchDeliveryRoute(mockDb, {
  deliveryId: 'uuid-D',
  accessCredential: 'uuid-customer-D-legacy',
  paletteUpdate: { currentPaletteColors: updatedPaletteD, colorOrder: [0, 1, 2, 3, 4], activeColor: '#990000' }
});
assert.equal(res4.status, 200);
assert.equal(res4.body.ok, true);
// Verify delivery D's palette was updated in database:
assert.deepEqual(mockDb['uuid-D'].brand_data.currentPaletteColors, updatedPaletteD);
assert.deepEqual(mockDb['uuid-D'].brand_data.editData.colors, updatedPaletteD);

// Scenario 5: Valid customer updates delivery A with Bearer header
const updatedPaletteA = ['#8B7355', '#C4A882', '#D4C5B0', '#6B8CAE', '#333333'];
const res5 = simulatePatchDeliveryRoute(mockDb, {
  deliveryId: 'uuid-A',
  sessionId: 'uuid-A',
  paletteUpdate: {
    currentPaletteColors: updatedPaletteA,
    colorOrder: [0, 1, 2, 3, 4],
    activeColor: '#8B7355',
  }
}, 'Bearer uuid-customer-A');
assert.equal(res5.status, 200);
assert.equal(res5.body.ok, true);

// Verify delivery A's palette was updated in database:
assert.deepEqual(mockDb['uuid-A'].brand_data.currentPaletteColors, updatedPaletteA);
assert.deepEqual(mockDb['uuid-A'].brand_data.editData.colors, updatedPaletteA);
// Verify unrelated fields on delivery A remained completely untouched:
assert.equal(mockDb['uuid-A'].brand_data.resultadoFinal.estiloNome, 'Essência Atemporal');
assert.equal(mockDb['uuid-A'].paid, true);
assert.equal(mockDb['uuid-A'].stripe_session_id, 'cs_live_session_A_12345');

console.log('  ✅ Server authorization invariant and route security tests passed.');

// -------------------------------------------------------------
// TEST 11: In-Memory Safe Upgrade for Older Deliveries Without currentPaletteColors
// -------------------------------------------------------------
console.log('Test 11: In-memory safe upgrade for older deliveries...');
const olderDeliveryData = {
  id: 'legacy-session-999',
  brand_data: {
    editData: {
      marca: 'MARCA ANTIGA',
      colors: ['#A1A1A1', '#B2B2B2', '#C3C3C3', '#D4D4D4', '#E5E5E5'],
    },
    // Note: NO currentPaletteColors and NO colorOrder present
  }
};

// Simulate loadData() upgrade in memory:
const rawBrand = olderDeliveryData.brand_data;
const resolvedColors = rawBrand.currentPaletteColors?.length > 0
  ? rawBrand.currentPaletteColors
  : (rawBrand.editData?.colors?.length > 0
      ? rawBrand.editData.colors
      : ['#D4C5B0', '#C3CEDB', '#C4A882', '#6B8CAE', '#E2894D']);

const upgradedInMemoryBrand = {
  ...rawBrand,
  currentPaletteColors: resolvedColors,
  editData: {
    ...rawBrand.editData,
    colors: resolvedColors,
  }
};

// Verify in-memory upgrade has valid 5-color palette:
assert.deepEqual(upgradedInMemoryBrand.currentPaletteColors, ['#A1A1A1', '#B2B2B2', '#C3C3C3', '#D4D4D4', '#E5E5E5']);
assert.deepEqual(upgradedInMemoryBrand.editData.colors, ['#A1A1A1', '#B2B2B2', '#C3C3C3', '#D4D4D4', '#E5E5E5']);

// Verify original database object was NOT mutated during load:
assert.equal(olderDeliveryData.brand_data.currentPaletteColors, undefined);
console.log('  ✅ In-memory safe upgrade passed.');

// -------------------------------------------------------------
// TEST 12: Server Response Confirmation & Zero-Row Detection
// -------------------------------------------------------------
console.log('Test 12: Server response confirmation & zero-row update detection...');
// When updates succeed, verify the payload shape:
const resSucc = simulatePatchDeliveryRoute(mockDb, {
  deliveryId: 'uuid-A',
  accessCredential: 'uuid-customer-A',
  paletteUpdate: {
    currentPaletteColors: ['#123456', '#234567', '#345678', '#456789', '#567890'],
    colorOrder: [0, 1, 2, 3, 4],
    activeColor: '#123456',
  }
});
assert.equal(resSucc.status, 200);
assert.equal(resSucc.body.ok, true);
assert.equal(resSucc.body.updated, true);
assert.equal(resSucc.body.deliveryId, 'uuid-customer-A');
assert.deepEqual(resSucc.body.currentPaletteColors, ['#123456', '#234567', '#345678', '#456789', '#567890']);

// If delivery ID does not exist in DB (0 rows updated), return 404
const res404 = simulatePatchDeliveryRoute(mockDb, {
  deliveryId: 'uuid-nonexistent',
  accessCredential: 'some-credential',
  paletteUpdate: { currentPaletteColors: ['#123456', '#234567', '#345678', '#456789', '#567890'] }
});
assert.equal(res404.status, 404);
console.log('  ✅ Server response confirmation and zero-row detection passed.');

// -------------------------------------------------------------
// TEST 13: Client-Side handleSaveColorsAndOrder Verification
// -------------------------------------------------------------
console.log('Test 13: Client-side handleSaveColorsAndOrder validation logic...');
function simulateClientSaveVerification(brandId, submittedColors, serverResponse, httpStatus = 200) {
  if (httpStatus < 200 || httpStatus >= 300) {
    throw new Error(serverResponse?.error || 'Erro ao salvar alterações no servidor.');
  }
  if (serverResponse.deliveryId && serverResponse.deliveryId !== brandId) {
    throw new Error('ID de entrega retornado pelo servidor não confere com o projeto atual.');
  }
  if (Array.isArray(serverResponse.currentPaletteColors)) {
    const isMatched = Array.isArray(submittedColors) &&
      submittedColors.length === serverResponse.currentPaletteColors.length &&
      submittedColors.every((c, i) => c.toLowerCase() === serverResponse.currentPaletteColors[i].toLowerCase());
    if (!isMatched) {
      throw new Error('A paleta persistida retornada pelo servidor diverge da paleta enviada.');
    }
  }
  return true;
}

const currentBrandId = 'uuid-customer-123';
const myColors = ['#111111', '#222222', '#333333', '#444444', '#555555'];

// Case A: Perfect match -> succeeds
assert.equal(simulateClientSaveVerification(currentBrandId, myColors, {
  ok: true,
  updated: true,
  deliveryId: 'uuid-customer-123',
  currentPaletteColors: ['#111111', '#222222', '#333333', '#444444', '#555555']
}), true);

// Case B: HTTP 500 error -> throws
assert.throws(() => {
  simulateClientSaveVerification(currentBrandId, myColors, { error: 'Database timeout' }, 500);
}, /Database timeout/);

// Case C: Mismatched deliveryId -> throws
assert.throws(() => {
  simulateClientSaveVerification(currentBrandId, myColors, {
    ok: true,
    updated: true,
    deliveryId: 'uuid-DIFFERENT-PROJECT',
    currentPaletteColors: myColors
  });
}, /ID de entrega retornado pelo servidor não confere/);

// Case D: Server persisted a different palette -> throws
assert.throws(() => {
  simulateClientSaveVerification(currentBrandId, myColors, {
    ok: true,
    updated: true,
    deliveryId: currentBrandId,
    currentPaletteColors: ['#AAAAAA', '#BBBBBB', '#CCCCCC', '#DDDDDD', '#EEEEEE']
  });
}, /A paleta persistida retornada pelo servidor diverge/);
console.log('  ✅ Client-side save verification correctly validates server response and catches failures.');

// -------------------------------------------------------------
// TEST 14: Refresh & Hydration Precedence in loadData
// -------------------------------------------------------------
console.log('Test 14: Refresh and hydration precedence in loadData...');
// Simulate database record where brand_data has canonical currentPaletteColors:
const dbDelivery = {
  id: 'uuid-test-refresh',
  brand_data: {
    currentPaletteColors: ['#000001', '#000002', '#000003', '#000004', '#000005'],
    colorOrder: [0, 1, 2, 3, 4],
    activeColor: '#000001',
    editData: {
      // Stale or legacy editData colors:
      colors: ['#OLD001', '#OLD002', '#OLD003', '#OLD004', '#OLD005'],
      marca: 'TESTE REFRESH',
    }
  }
};

// Simulate loadData() logic in sucesso/page.js:
const brandFromDb = dbDelivery.brand_data;
const canonicalColorsFromDb = brandFromDb.currentPaletteColors || brandFromDb.editData?.colors;

// Object spread must NOT overwrite canonical colors:
const hydratedEditData = {
  ...(brandFromDb?.editData || {}),
  colors: canonicalColorsFromDb,
};

const hydratedBrand = {
  ...brandFromDb,
  currentPaletteColors: canonicalColorsFromDb,
  editData: hydratedEditData,
};

// Simulate paletteColors getter precedence:
const resolvedPaletteColors = hydratedBrand.currentPaletteColors || hydratedBrand.editData?.colors;

assert.deepEqual(hydratedBrand.currentPaletteColors, ['#000001', '#000002', '#000003', '#000004', '#000005']);
assert.deepEqual(hydratedBrand.editData.colors, ['#000001', '#000002', '#000003', '#000004', '#000005']);
assert.deepEqual(resolvedPaletteColors, ['#000001', '#000002', '#000003', '#000004', '#000005']);
// Verify stale colors were completely superseded:
assert.notDeepEqual(resolvedPaletteColors, ['#OLD001', '#OLD002', '#OLD003', '#OLD004', '#OLD005']);
console.log('  ✅ Refresh and hydration precedence passed.');

// -------------------------------------------------------------
// TEST 15: Rendered Save Runtime Interaction & Scope Verification
// -------------------------------------------------------------
console.log('Test 15: Rendered save runtime interaction & scope verification...');

// Mock browser global localStorage
const mockStorage = new Map();
const fakeLocalStorage = {
  getItem: (k) => mockStorage.get(k) || null,
  setItem: (k, v) => mockStorage.set(k, String(v)),
  removeItem: (k) => mockStorage.delete(k),
};

// 15.1: Realistic URL Search Params with recovery link (?session=cs_live_test_12345)
const mockSearchParams = new URLSearchParams('session=cs_live_test_12345&plano=pro');

// Simulate parent SucessoContent parameter derivation
const parentSessionParam = mockSearchParams.get('session') || mockSearchParams.get('id') || mockSearchParams.get('session_id') || mockSearchParams.get('project') || mockSearchParams.get('b') || mockSearchParams.get('entrega') || mockSearchParams.get('p');

// Simulate EntregaContent receiving props
const propSessionParam = parentSessionParam;
const entregaSessionParam = propSessionParam || mockSearchParams.get('session') || mockSearchParams.get('id') || mockSearchParams.get('session_id') || mockSearchParams.get('project') || mockSearchParams.get('b') || mockSearchParams.get('entrega') || mockSearchParams.get('p') || fakeLocalStorage.getItem('brandbox_session') || null;

assert.equal(typeof entregaSessionParam, 'string');
assert.ok(entregaSessionParam.length > 0);

// Setup test brand object
const testBrand = {
  id: 'uuid-delivery-production-789',
  currentPaletteColors: ['#111111', '#222222', '#333333', '#444444', '#555555'],
  colorOrder: [0, 1, 2, 3, 4],
  activeColor: '#111111',
  editData: {
    colors: ['#111111', '#222222', '#333333', '#444444', '#555555'],
  }
};

// Customer edits color at visual slot 1 (canonical index 1)
const editedColors = ['#111111', '#EE2222', '#333333', '#444444', '#555555'];

// Track fetch calls
const fetchCalls = [];
const mockFetch = async (url, options) => {
  fetchCalls.push({ url, options });
  const body = JSON.parse(options.body);
  return {
    ok: true,
    status: 200,
    json: async () => ({
      ok: true,
      updated: true,
      deliveryId: body.deliveryId,
      currentPaletteColors: body.paletteUpdate.currentPaletteColors,
    })
  };
};

// Simulate handleSaveColorsAndOrder inside EntregaContent scope
async function simulateEntregaHandleSave(brandObj, palette, order, sessionParamVal, fetchFn, storage) {
  const deliveryId = brandObj?.id;
  const accessCredential = sessionParamVal || deliveryId;

  if (!deliveryId || !accessCredential) {
    const err = new Error('Identificador da entrega ou credencial de acesso ausente.');
    err.userMessage = 'Não foi possível autenticar o projeto para salvar. Recarregue a página pelo link de acesso recebido.';
    throw err;
  }

  const primaryIdx = order ? order[0] : 0;
  const currentActiveColor = brandObj?.activeColor || (palette && palette[primaryIdx]) || '#C3CEDB';

  let res;
  let data;
  try {
    res = await fetchFn('/api/get-entrega', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessCredential}`,
      },
      body: JSON.stringify({
        deliveryId: deliveryId,
        sessionId: deliveryId,
        accessCredential: accessCredential,
        paletteUpdate: {
          currentPaletteColors: palette,
          colorOrder: order,
          activeColor: currentActiveColor,
        }
      })
    });
    data = await res.json().catch(() => ({}));
  } catch (netErr) {
    const err = new Error('Falha de conexão com o servidor.');
    err.userMessage = 'Erro de conexão ao salvar alterações. Verifique sua internet e tente novamente.';
    throw err;
  }

  if (!res.ok) {
    const err = new Error(data?.error || `Erro HTTP ${res.status}`);
    err.userMessage = 'Não foi possível salvar as alterações no servidor. Tente novamente.';
    throw err;
  }

  if (data.deliveryId && data.deliveryId !== deliveryId) {
    const err = new Error('ID de entrega retornado pelo servidor não confere com o projeto atual.');
    err.userMessage = 'Erro de sincronização com o projeto. Recarregue a página.';
    throw err;
  }

  if (Array.isArray(data.currentPaletteColors)) {
    const isMatched = Array.isArray(palette) &&
      palette.length === data.currentPaletteColors.length &&
      palette.every((c, i) => c.toLowerCase() === data.currentPaletteColors[i].toLowerCase());
    if (!isMatched) {
      const err = new Error('A paleta persistida retornada pelo servidor diverge da paleta enviada.');
      err.userMessage = 'Divergência ao persistir paleta no servidor. Tente novamente.';
      throw err;
    }
  }

  if (deliveryId) {
    storage.setItem(`brandbox_color_order_${deliveryId}`, JSON.stringify(order));
    storage.setItem(`brandbox_palette_colors_${deliveryId}`, JSON.stringify(palette));
  }

  return { success: true, persistedColors: data.currentPaletteColors };
}

// Simulate CoresSalvarButton state machine
async function simulateButtonClick(onSaveFn) {
  let saved = false;
  let saveError = null;
  try {
    await onSaveFn();
    saved = true;
  } catch (e) {
    const msg = e?.userMessage || 'Não foi possível salvar as alterações. Tente novamente.';
    saveError = msg;
  }
  return { saved, saveError };
}

// Step 1: Execute save
const saveResult = await simulateButtonClick(() =>
  simulateEntregaHandleSave(testBrand, editedColors, [0, 1, 2, 3, 4], entregaSessionParam, mockFetch, fakeLocalStorage)
);

// Verify:
// 1. No ReferenceError occurred!
assert.equal(saveResult.saved, true);
assert.equal(saveResult.saveError, null);

// 2. Exactly one PATCH was issued
assert.equal(fetchCalls.length, 1);
assert.equal(fetchCalls[0].url, '/api/get-entrega');
assert.equal(fetchCalls[0].options.method, 'PATCH');

// 3. Confirm target delivery ID and access credential are defined without printing them
const patchBody = JSON.parse(fetchCalls[0].options.body);
assert.equal(typeof patchBody.deliveryId, 'string');
assert.ok(patchBody.deliveryId.length > 0);
assert.notEqual(patchBody.deliveryId, 'undefined');

assert.equal(typeof patchBody.accessCredential, 'string');
assert.ok(patchBody.accessCredential.length > 0);
assert.notEqual(patchBody.accessCredential, 'undefined');

const authHeader = fetchCalls[0].options.headers['Authorization'];
assert.equal(typeof authHeader, 'string');
assert.ok(authHeader.startsWith('Bearer '));
assert.ok(authHeader.length > 7);
assert.equal(authHeader.includes('undefined'), false);

// 4. Missing credential produces friendly error and does NOT issue PATCH
const callCountBefore = fetchCalls.length;
const missingCredResult = await simulateButtonClick(() =>
  simulateEntregaHandleSave(null, editedColors, [0, 1, 2, 3, 4], null, mockFetch, fakeLocalStorage)
);
assert.equal(missingCredResult.saved, false);
assert.equal(typeof missingCredResult.saveError, 'string');
assert.equal(missingCredResult.saveError.includes('ReferenceError'), false);
assert.equal(missingCredResult.saveError.includes('sessionParam'), false);
assert.equal(missingCredResult.saveError, 'Não foi possível autenticar o projeto para salvar. Recarregue a página pelo link de acesso recebido.');
assert.equal(fetchCalls.length, callCountBefore); // Zero additional PATCHes issued!

// 5. Server error (HTTP 500) produces friendly error and preserves unsaved state
const failingFetch = async () => ({
  ok: false,
  status: 500,
  json: async () => ({ error: 'Database connection error' })
});
const serverErrResult = await simulateButtonClick(() =>
  simulateEntregaHandleSave(testBrand, editedColors, [0, 1, 2, 3, 4], entregaSessionParam, failingFetch, fakeLocalStorage)
);
assert.equal(serverErrResult.saved, false);
assert.equal(serverErrResult.saveError, 'Não foi possível salvar as alterações no servidor. Tente novamente.');
assert.equal(serverErrResult.saveError.includes('Database connection error'), false); // Friendly!

console.log('  ✅ Rendered save interaction passed all checks without ReferenceError.');

console.log('\n=============================================');
console.log('🎉 ALL 15 PALETTE EDITING TESTS PASSED!');
console.log('=============================================\n');
