export const OPERATORS = ['+', '-', '*', '/', '%', '**', ')', '(']

// https://github.com/josdejong/mathjs/blob/develop/src/expression/parse.js
export const DELIMITERS = {
  ',': true,
  '(': true,
  ')': true,
  '[': true,
  ']': true,
  '{': true,
  '}': true,
  '"': true,
  "'": true,
  ';': true,

  '+': true,
  '-': true,
  '*': true,
  '.*': true,
  '/': true,
  './': true,
  '%': true,
  '^': true,
  '.^': true,
  '~': true,
  '!': true,
  '&': true,
  '|': true,
  '^|': true,
  '=': true,
  ':': true,
  '?': true,

  '==': true,
  '!=': true,
  '<': true,
  '>': true,
  '<=': true,
  '>=': true,

  '<<': true,
  '>>': true,
  '>>>': true,
}
