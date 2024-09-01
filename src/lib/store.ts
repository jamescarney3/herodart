import Collection from '~/lib/collection';
import Model from '~/lib/model';

export default class Store {
  static _data: Record<string, Collection<Model>> = {};
}

interface ModelConstructor<A, T> {
  new (attributes: A): T;
  _key: string | null;
  _storeKey: string;
}

export function collection<A, T>(constructor: ModelConstructor<A, T>) {
  const modelKey = constructor._key;
  const key = constructor._storeKey;

  Store._data[key] ||= new Collection([], { key: modelKey || null });
}
