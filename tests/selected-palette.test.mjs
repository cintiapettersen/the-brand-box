import assert from 'node:assert/strict';
import { findSelectedPalette, serializeSelectedPalette } from '../src/lib/selectedPalette.js';
const palettes = [{ id: 1, estilo_id: 7, nome_variacao: 'Current', paleta_hex: ['#abcdef', '#123456'] }, { id: '2', estilo_id: 8, nome_variacao: 'Other', cores_hex: ['#AABBCC', '#DDEEFF'] }];
const context = { styleId: 7, styleName: 'Current style', journeyId: 'journey-a' };
assert.deepEqual(findSelectedPalette(palettes, 1, context), { id: '1', styleId: '7', styleName: 'Current style', journeyId: 'journey-a', name: 'Current', hex: ['#ABCDEF', '#123456'] });
assert.equal(findSelectedPalette(palettes, '2', context), null);
assert.equal(serializeSelectedPalette({ id: 3, estilo_id: 7, paleta_hex: ['bad'] }, context), null);
console.log('selected palette serialization tests passed');
