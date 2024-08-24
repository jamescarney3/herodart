import { describe, expect, it, vi, afterEach } from 'vitest';

import Model, { prop, key, belongsTo, hasMany, observed } from '~/lib/model';
import Store from '~/lib/store';

vi.mock('~/lib/store', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    default: {},
  };
});

describe('Model class module', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('@prop decorator', () => {
    it('allows Model constructor to set attributes', () => {
      class Foo extends Model {
        @prop declare bar: string;
        @prop declare qux: string;
      }

      const foo = new Foo({ bar: 'baz', qux: 'garply', hoge: 'fuga' });

      expect(foo).toHaveProperty('bar', 'baz');
      expect(foo).toHaveProperty('qux', 'garply');
      expect(foo).not.toHaveProperty('hoge');
    });
  });

  describe('@key decorator', () => {
    it('allows Model constructor to set a unique key attribute', () => {
      class Foo extends Model {
        @key declare myKey: string;
      }

      expect(Foo.prototype._key).toBe('myKey');
    });
  });

  describe('@belongsTo decorator', () => {
    it('sets a relation accessor on Model instance', () => {
      const bar1 = { id: 1 };
      const bar2 = { id: 2 };
      Object.getPrototypeOf(bar2)._key = 'id';

      Store._data = {
        'bars': {
          find: vi.fn((id) =>  {
            if (id === 1) return bar1;
            if (id === 2) return bar2;
            return undefined;
          }),
        },
      };

      class Foo extends Model {
        @belongsTo('bars', { foreignKey: 'barId' }) declare bar: unknown;
      }

      const foo = new Foo({ bar: bar1 });
      expect(foo.bar).toBe(bar1);

      foo.bar = bar2;
      expect(foo.bar).toBe(bar2);
    });
  });

  describe('@hasMany decorator', () => {
    it('sets a relation collection accessor on Model instance', () => {
      const bar1 = { _fooId: 1 };
      const bar2 = { _fooId: 1 };
      const bar3 = { _fooId: 2 };
      const bar4 = {};

      Store._data = { 'bars': [bar1, bar2, bar3] };
      Store._data['bars'].add = Store._data['bars'].push;

      class Foo extends Model {
        @key declare id: number;
        @hasMany('bars', { foreignKey: 'fooId' }) declare bars: unknown;
      }

      const foo1 = new Foo({ id: 1 });
      const foo2 = new Foo({ id: 2 });

      expect(foo1.bars).toContain(bar1);
      expect(foo1.bars).toContain(bar2);
      expect(foo1.bars).not.toContain(bar3);
      expect(foo2.bars).toContain(bar3);
      expect(foo2.bars).not.toContain(bar1);
      expect(foo2.bars).not.toContain(bar2);

      foo2.bars = [bar2, bar4];
      expect(foo2.bars).toContain(bar2);
      expect(foo2.bars).toContain(bar2);
      expect(foo2.bars).not.toContain(bar3);
      expect(foo1.bars).not.toContain(bar2);

      expect(bar3).not.toHaveProperty('_fooId');
      expect(bar4).toHaveProperty('_fooId', 2);
    });
  });

  describe('@observed decorator', () => {
    it('invokes observe callback on decorated method call', () => {
      const observe = vi.fn();

      class Foo extends Model{
        barMethod() {}

        @observed
        bazMethod() {}
      }

      const foo = new Foo({ observe });

      foo.barMethod();
      expect(observe).not.toHaveBeenCalled();

      foo.bazMethod();
      expect(observe).toHaveBeenCalledOnce();
    });
  });

  describe('Model class', () => {
    describe('instance#create', () => {
      it('instantiates a model and adds it to a collection', () => {
        Store._data = { 'foos': { add: vi.fn() } };

        class Foo extends Model {
          _storeKey = 'foos';
        }

        const foo = Foo.create();
        expect(Store._data['foos'].add).toHaveBeenCalledWith(foo);
      });
    });
  });
});
