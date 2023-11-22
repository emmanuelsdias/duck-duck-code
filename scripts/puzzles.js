// Puzzles are stored as strings, with each line representing a new row of cubes
// Each character represents a cube (or not), according to the following:
//
// d: Cube where the duck starts
// x/X: Default cube (without/with lost duckling)
// b/B: Water cube (without/with lost duckling)
// .: No cube

export const puzzles = {
  size: 6,

  1:  'dXX',

  2:  'dXX' + '\n' +
      '..X' + '\n' +
      '..X',

  3:  'dXB' + '\n' +
      '..X' + '\n' +
      '..X',

  4:  'dXX' + '\n' +
      'X.X' + '\n' +
      'XXX',

  5:  'dXB' + '\n' +
      'X.X' + '\n' +
      'BXB',

  6:  'XXX..' + '\n' +
      'X.X..' + '\n' +
      'XXdXX' + '\n' +
      '..X.X' + '\n' +
      '..XXX',
  
  7:  'XXXXX' + '\n' +
      'X.X.X' + '\n' +
      'XXdXX' + '\n' +
      'X.X.X' + '\n' +
      'XXXXX',
  
  8:  '.XXX.' + '\n' +
      'XxxxX' + '\n' +
      'XxdxX' + '\n' +
      'XxxxX' + '\n' +
      '.XXX.',
}