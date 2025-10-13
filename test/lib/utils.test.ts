import { beforeEach, describe, expect, it } from 'vitest';

import { hasOwnOrInherits, formatEvalString } from '~/lib/utils';

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
});
