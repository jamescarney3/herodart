import { beforeEach, describe, expect, it } from 'vitest';

import { hasOwnOrInherits, formatEvalString, validateLegsScore, roundNumber } from '~/lib/utils';

describe('utils module', () => {
  describe('hasOwnOrInherits', () => {
    class ParentFoo {
      inheritedMethod() {}
      overwrittenMethod() {}
    }

    class ChildBar extends ParentFoo {
      ownMethod() {}
      overwrittenMethod() {}
    }

    const bar = new ChildBar();

    beforeEach(() => {
      bar.instanceProperty = 'baz';
    });

    it('returns true for inherited property', () => {
      expect(hasOwnOrInherits(bar, 'inheritedMethod')).toBe(true);
    });

    it('returns true for prototype property', () => {
      expect(hasOwnOrInherits(bar, 'ownMethod')).toBe(true);
    });

    it('returns true for instance property'), () => {
      expect(hasOwnOrInherits(bar, 'instanceProperty')).toBe(true);
    };

    it('returns false for nonexistent property', () => {
      expect(hasOwnOrInherits(bar, 'nonexistentProperty')).toBe(false);

      delete bar.instanceProperty;
      expect(hasOwnOrInherits(bar, 'instanceProperty')).toBe(false);

      delete bar.ownMethod;
      expect(hasOwnOrInherits(bar, 'ownMethod')).toBe(true);

      delete bar.inheritedMethod;
      expect(hasOwnOrInherits(bar, 'inheritedMethod')).toBe(true);
    });
  });

  describe('formatEvalString', () => {
    it('formats simple addition', () => {
      expect(formatEvalString('2+3')).toBe('2 + 3');
    });

    it('formats simple multiplication', () => {
      expect(formatEvalString('2*3')).toBe('(2×3)');
    });

    it('formats addition and multiplication', () => {
      expect(formatEvalString('20+19*3+5')).toBe('20 + (19×3) + 5');
    });

    it('handles multiple multiplications', () => {
      expect(formatEvalString('2*3+4*5')).toBe('(2×3) + (4×5)');
    });

    it('handles leading multiplication', () => {
      expect(formatEvalString('2*3+4')).toBe('(2×3) + 4');
    });

    it('handles trailing multiplication', () => {
      expect(formatEvalString('4+2*3')).toBe('4 + (2×3)');
    });

    it('handles only numbers', () => {
      expect(formatEvalString('42')).toBe('42');
    });

    it('handles empty string', () => {
      expect(formatEvalString('')).toBe('');
    });

    it('handles incomplete multiplication at end', () => {
      expect(formatEvalString('2*')).toBe('2×');
    });
  });

  describe('validateLegsScore', () => {
    it('returns true for valid scores under 180', () => {
      expect(validateLegsScore(0)).toBe(true);
      expect(validateLegsScore(1)).toBe(true);
      expect(validateLegsScore(2)).toBe(true);
      expect(validateLegsScore(3)).toBe(true);
      expect(validateLegsScore(60)).toBe(true);
      expect(validateLegsScore(100)).toBe(true);
      expect(validateLegsScore(170)).toBe(true);
    });

    it('returns false for scores over 180', () => {
      expect(validateLegsScore(181)).toBe(false);
      expect(validateLegsScore(200)).toBe(false);
    });

    it('returns false for impossible three-dart scores', () => {
      expect(validateLegsScore(163)).toBe(false);
      expect(validateLegsScore(179)).toBe(false);
    });
  });

  describe('roundNumber', () => {
    it('rounds to nearest integer when places is not specified', () => {
      expect(roundNumber(4.6)).toBe(5);
      expect(roundNumber(4.4)).toBe(4);
      expect(roundNumber(-1.6)).toBe(-2);
      expect(roundNumber(-1.4)).toBe(-1);
    });

    it('rounds to specified decimal places', () => {
      expect(roundNumber(4.444, 2)).toBe(4.44);
      expect(roundNumber(4.446, 2)).toBe(4.45);
      expect(roundNumber(8.7654321, 5)).toBe(8.76543);
      expect(roundNumber(8.765436, 5)).toBe(8.76544);
      expect(roundNumber(-2.556, 2)).toBe(-2.56);
      expect(roundNumber(-2.554, 2)).toBe(-2.55);
    });

    it('handles zero and negative numbers', () => {
      expect(roundNumber(0, 2)).toBe(0);
      expect(roundNumber(-0.006, 2)).toBe(-0.01);
    });

    it('handles large and small numbers', () => {
      expect(roundNumber(123456.789, 0)).toBe(123457);
      expect(roundNumber(0.0001234, 6)).toBe(0.000123);
    });
  });
});
