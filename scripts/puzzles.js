// Puzzles are stored as strings, with each line representing a new row of cubes
// Each character represents a cube (or not), according to the following:
//
// D: Cube where the duck starts
// L: Cube with a lost duckling
// X: Cube
// .: No cube

const puzzle1 = 
'DLL';

const puzzle2 = 
'DLL' + '\n' +
'..L' + '\n' +
'..L';

const puzzle3 =
'DLL' + '\n' +
'L.L' + '\n' +
'LLL';

const puzzle4 = 
'LLL..' + '\n' +
'L.L..' + '\n' +
'LLDLL' + '\n' +
'..L.L' + '\n' +
'..LLL';

const puzzle5 = 
'LLLLL' + '\n' +
'L.L.L' + '\n' +
'LLDLL' + '\n' +
'L.L.L' + '\n' +
'LLLLL';

const puzzle6 = 
'.LLL.' + '\n' +
'LXXXL' + '\n' +
'LXDXL' + '\n' +
'LXXXL' + '\n' +
'.LLL.';

export const puzzles = [puzzle1, puzzle2, puzzle3, puzzle4, puzzle5, puzzle6]