import { describe, expect, it } from '@jest/globals';
import {
  LineGenerationType,
  LineProvider,
  getRandomNumber,
} from '../../common/lineProvider';

describe('Line Provider Helper', () => {
  describe('Psuedorandom number generator', () => {
    it('Should return a random number between 0 and 100', () => {
      let number;
      let res = true;
      for (let index = 0; index < 10000; index += 1) {
        number = getRandomNumber(100);
        res = number <= 100 && number >= 0;
        if (!res) break;
      }
      expect(res).toBe(true);
    });
  });
});

describe('Line provider', () => {
  it('Should generate lines with all the letters of the alphabeth except I', () => {
    const lp = new LineProvider(LineGenerationType.Random);
    const alphabet = [
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z',
    ];

    const letters: string[] = [];

    while (letters.length < 25) {
      lp.getNextLine().Letters.forEach((l) => {
        if (!letters.includes(l)) letters.push(l);
      });
    }

    expect(letters.sort()).toEqual(alphabet.sort());
    expect(letters).not.toEqual(expect.arrayContaining(['I']));
  }, 5000);
});
