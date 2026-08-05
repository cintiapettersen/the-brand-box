import test from 'node:test';
import assert from 'node:assert/strict';
import { isCurrentPaletteFeedback, shouldClearPaletteFeedback } from '../src/lib/paletteFeedbackState.js';

const journeyId = 'journey-1';
const initialPalette = { id: 'initial-1', styleId: 'style-1', hex: ['#111111', '#222222', '#333333', '#444444', '#555555'] };
const anotherInitialPalette = { id: 'initial-2', styleId: 'style-1', hex: ['#AAAAAA', '#BBBBBB', '#CCCCCC', '#DDDDDD', '#EEEEEE'] };
const generatedPalette = { id: 'consulted-1', styleId: 'style-1', hex: ['#101010', '#202020', '#303030', '#404040', '#505050'] };
const anotherGeneratedPalette = { id: 'consulted-2', styleId: 'style-1', hex: ['#121212', '#232323', '#343434', '#454545', '#565656'] };
const feedbackFor = palette => ({ context: { journeyId, styleId: palette.styleId, paletteId: palette.id, hex: palette.hex, primaryColor: palette.hex[2], language: 'pt-BR' } });

test('changing between initial or generated palettes always clears the previous color feedback', () => {
  assert.equal(shouldClearPaletteFeedback(initialPalette.id, anotherInitialPalette.id), true);
  assert.equal(shouldClearPaletteFeedback(initialPalette.id, generatedPalette.id), true);
  assert.equal(shouldClearPaletteFeedback(generatedPalette.id, anotherGeneratedPalette.id), true);
  assert.equal(shouldClearPaletteFeedback(generatedPalette.id, generatedPalette.id), false);
});

test('only feedback for the current journey, palette, HEX, color and language is displayed or restored', () => {
  const feedback = feedbackFor(generatedPalette);
  assert.equal(isCurrentPaletteFeedback(feedback, generatedPalette, generatedPalette.hex[2], journeyId, 'pt-BR'), true);
  assert.equal(isCurrentPaletteFeedback(feedback, initialPalette, generatedPalette.hex[2], journeyId, 'pt-BR'), false);
  assert.equal(isCurrentPaletteFeedback(feedback, generatedPalette, anotherGeneratedPalette.hex[2], journeyId, 'pt-BR'), false);
  assert.equal(isCurrentPaletteFeedback(feedback, generatedPalette, generatedPalette.hex[2], 'other-journey', 'pt-BR'), false);
  assert.equal(isCurrentPaletteFeedback(feedback, generatedPalette, generatedPalette.hex[2], journeyId, 'en'), false);
});
