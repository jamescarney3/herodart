import Collection from '~/lib/collection';

export default class Store {
  static _data = {};
}

export function collection<T>(constructor: () => T) {
  const modelKey = constructor._key;
  const key = constructor._storeKey;

  Store._data[key] ||= new Collection([], { key : modelKey });
  constructor.prototype._storeData = Store._data;
  constructor.prototype._collection = Store._data[key];
}
