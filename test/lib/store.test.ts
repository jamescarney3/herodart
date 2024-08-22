import { describe, expect, it } from 'vitest';

import Store, { collection } from '~/lib/store';

describe('global Store class', () => {
  it('has a singleton data prop', () => {
    class OtherStore extends Store {}
    expect(OtherStore._data).toBe(Store._data);
  });
});

describe('@collection decorator', () => {
  it('registers a collection of instances of a class with a _storeKey static prop', () => {
    @collection
    class Foo {
      static _storeKey = 'foos';
    }

    expect(Store._data).toHaveProperty('foos');
    expect(Foo.prototype._storeData).toBe(Store._data);
    expect(Foo.prototype._collection).toBe(Store._data['foos']);
  });
});
