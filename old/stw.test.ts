import { expect, test } from 'bun:test';
import { stw } from './stw.js';

//
//

test('stw aplica regra fixa', () => {
  expect(stw('flex')).toBe('display:flex;');
  expect(stw('block')).toBe('display:block;');
});

test('stw aplica regra dinâmica simples', () => {
  expect(stw('mt-2')).toBe('margin-top:0.5rem;');
  expect(stw('mb-4')).toBe('margin-bottom:1rem;');
});

test('stw aplica regra dinâmica composta', () => {
  expect(stw('mx-3')).toBe('margin-left:0.75rem;margin-right:0.75rem;');
  expect(stw('py-1')).toBe('padding-top:0.25rem;padding-bottom:0.25rem;');
});

test('stw múltiplas classes', () => {
  expect(stw('flex mt-2')).toBe('display:flex;margin-top:0.5rem;');
  expect(stw('block px-4')).toBe(
    'display:block;padding-left:1rem;padding-right:1rem;',
  );
});

test('stw reaplica classes repetidas', () => {
  expect(stw('mt-2 flex block flex')).toBe(
    'margin-top:0.5rem;display:flex;display:block;display:flex;',
  );
  expect(stw('flex mt-2 mb-4 flex')).toBe(
    'display:flex;margin-top:0.5rem;margin-bottom:1rem;display:flex;',
  );
});

test('espaços vazios são ignorados', () => {
  expect(stw('         mt-2            flex block           ')).toBe(
    'margin-top:0.5rem;display:flex;display:block;',
  );
});

test('propriedades com mais de 1 -', () => {
  expect(stw('gap-x-2')).toBe('column-gap:0.5rem;');
  expect(stw('gap-y-4')).toBe('row-gap:1rem;');
  expect(stw('min-w-2 mt-2')).toBe('min-width:0.5rem;margin-top:0.5rem;');
  expect(stw('max-h-4 mb-4')).toBe('max-height:1rem;margin-bottom:1rem;');
});
