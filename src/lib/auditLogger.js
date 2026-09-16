/**
 * Envia telemetria de download e aceite para registrar provas digitais de entrega
 */
export async function trackDownloadEvent({ email = '', entregaId = '', itemName = '', eventType = 'download', marca = '', crm = '' }) {
  try {
    fetch('/api/log-download', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        entregaId,
        itemName,
        eventType,
        marca,
        crm,
      }),
    }).catch(err => console.warn('Falha no envio de telemetria:', err));
  } catch (e) {
    // Fail silently
  }
}
