import { describe, expect, it } from 'vitest';

import Collection from '~/lib/collection';

describe('Collection class', () => {
  it('cannot initialize with key collision', () => {
    expect(() => new Collection([{ id: 1 }, { id: 1 }], { key: 'id' })).toThrowError();
  });

  describe('Collection#add', () => {
    it('adds a new member to a collection', () => {
      const unkeyedCollection = new Collection([]);
      const unkeyedMember = 'foo';
      unkeyedCollection.add(unkeyedMember);
      expect(unkeyedCollection).toContain(unkeyedMember);

      const keyedCollection = new Collection([], { key: 'id' });
      const keyedMember = { id: 'foo' };
      keyedCollection.add(keyedMember);
      expect(keyedCollection).toContain(keyedMember);
    });

    it('throws an error on key collision', () => {
      const collection = new Collection([{ id: 1 }, { id: 2 }], { key: 'id' });
      expect(() => collection.add({ id: 1 })).toThrowError();
    });

    it('throws an error on missing key for keyed Collection', () => {
      const collection = new Collection([], { key: 'id' });
      expect(() => collection.add({})).toThrowError();
    });
  });

  describe('Collection#get', () => {
    it('finds a keyed Collection memeber', () => {
      const collection = new Collection([{ id: 1 }, { id: 2 }, { id: 3 }], { key: 'id' });
      expect(collection.get(2)).toEqual({ id: 2 });
    });
    it('throws an error for un-keyed Collection', () => {
      const collection = new Collection([{ foo: 'bar' }, { bar: 'baz' }]);
      expect(() => collection.get('bar')).toThrowError();
    });
  });

  describe('Collection#findBy', () => {
    it('finds a Collection member matching predicate arg', () => {
      const collection = new Collection([{ foo: 'bar' }, { baz: 'qux' }]);
      expect(collection.findBy((member) => member.foo === 'bar')).toEqual({ foo: 'bar' });
    });
  });

  describe('Collection#first', () => {
    it('returns the last member of a collection', () => {
      expect(new Collection(['foo', 'bar', 'baz']).first).toBe('foo');
      expect(new Collection([]).first).toBe(undefined);
    });
  });

  describe('Collection#last', () => {
    it('returns the last member of a collection', () => {
      expect(new Collection(['foo', 'bar', 'baz']).last).toBe('baz');
      expect(new Collection([]).last).toBe(undefined);
    });
  });
});
