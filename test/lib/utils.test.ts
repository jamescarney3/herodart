import { beforeEach, describe, expect, it } from 'vitest';

import { hasOwnOrInhertits } from '~/lib/utils';

describe('utils module', () => {
  describe('hasOwnOrInhertits', () => {
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
      expect(hasOwnOrInhertits(bar, 'inheritedMethod')).toBe(true);
    });

    it('returns true for prototype property', () => {
      expect(hasOwnOrInhertits(bar, 'ownMethod')).toBe(true);
    });

    it('returns true for instance property'), () => {
      expect(hasOwnOrInhertits(bar, 'instanceProperty')).toBe(true);
    };

    it('returns false for nonexistent property', () => {
      expect(hasOwnOrInhertits(bar, 'nonexistentProperty')).toBe(false);

      delete bar.instanceProperty;
      expect(hasOwnOrInhertits(bar, 'instanceProperty')).toBe(false);

      delete bar.ownMethod;
      expect(hasOwnOrInhertits(bar, 'ownMethod')).toBe(true);

      delete bar.inheritedMethod;
      expect(hasOwnOrInhertits(bar, 'inheritedMethod')).toBe(true);
    });
  });
});
