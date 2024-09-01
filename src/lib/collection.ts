import type Model from '~/lib/model';

export type CollectionOptions = {
  key?: string;
};

// pseudo-keyed array
export default class Collection<T> extends Array {
  constructor(data: T[], options: CollectionOptions = {}) {
    if (!Array.isArray(data)) {
      // array filter and map methods call this with a single array length arg; anywhere this app
      // constructs a new collection it will be passed an array
      super(data);
    } else {
      // can't just spread data into here because of the way the constructor will instantiate a
      // blank array with a single argument, so instantiate the blank array anyway and then splice
      // the spread data arg into it
      super(data.length);
      this.splice(0, data.length, ...data);

      // set key if applicable and error on collision
      const { key } = options;
      if (key) {
        this.key = key;
        const keys = data.map((el) => el[key]);
        keys.forEach((k, i) => {
          if (keys.indexOf(k) !== i) {
            throw new Error(`Collection may not include members with duplicate ${key} keys`);
          }
        });
      }
    }
  }

  add(model: Model): Collection {
    if (this.key && !model[this.key]) {
      throw new Error(`${this.key} keyed Collection element must have key ${this.key}`);
    }
    if (this.key && this.map((current) => current[this.key]).includes(model[this.key])) {
      throw new Error(`Collection already includes element with key ${this.key}: ${model[this.key]}`);
    }
    this.push(model);
  }

  find(key: string | number): T | undefined {
    if (!Object.hasOwn(this, 'key')) {
      throw new Error('cannot #find on un-keyed Collection');
    }
    return super.find((element: T) => element[this.key] === key);
  }

  findBy(predicate: (T) => boolean): T | undefined {
    return super.find(predicate);
  }

  get last() {
    return this.slice(-1)[0];
  }

  get first() {
    return this[0];
  }
}