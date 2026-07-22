// Script de teste automatizado para verificar a regra estrita de acesso (Whitelist)

function checkAccess(data) {
  const isLegacyRecord = data.payment_status === null || data.payment_status === undefined;
  const isConfirmedPaid = data.payment_status === 'paid' && data.paid === true;

  if (!isLegacyRecord && !isConfirmedPaid) {
    return { allowed: false, status: 402, reason: data.payment_status || 'unauthorized' };
  }
  return { allowed: true, status: 200 };
}

const testCases = [
  { name: '1. Registro legado com payment_status = null', input: { payment_status: null, paid: false }, expected: true },
  { name: '2. Registro legado com payment_status = undefined', input: { payment_status: undefined, paid: false }, expected: true },
  { name: '3. Registro novo rascunho (pending e paid = false)', input: { payment_status: 'pending', paid: false }, expected: false },
  { name: '4. Pix pendente/gerado (unpaid e paid = false)', input: { payment_status: 'unpaid', paid: false }, expected: false },
  { name: '5. Pagamento recusado/expirado (failed e paid = false)', input: { payment_status: 'failed', paid: false }, expected: false },
  { name: '6. Cartão pago confirmado (paid e paid = true)', input: { payment_status: 'paid', paid: true }, expected: true },
  { name: '7. Pix pago confirmado (paid e paid = true)', input: { payment_status: 'paid', paid: true }, expected: true },
  { name: '8. Cupom 100% grátis confirmado (paid e paid = true)', input: { payment_status: 'paid', paid: true }, expected: true },
  { name: '9. Status desconhecido (ex: processing / refunded)', input: { payment_status: 'processing', paid: false }, expected: false },
];

console.log('🧪 EXECUTANDO TESTES DAS REGRAS DE ACESSO:\n');
let passed = 0;
testCases.forEach(tc => {
  const res = checkAccess(tc.input);
  const ok = res.allowed === tc.expected;
  if (ok) passed++;
  console.log(`${ok ? '✅ PASS' : '❌ FAIL'}: ${tc.name} -> Resultado: ${res.allowed ? 'PERMITIDO (200)' : 'NEGADO (402)'}`);
});

console.log(`\nTOTAL: ${passed}/${testCases.length} testes passaram com sucesso.`);
if (passed !== testCases.length) {
  process.exit(1);
}
