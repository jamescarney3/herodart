import Store from '~/lib/v2/store';
import Observer from '~/lib/v2/observer';
import type Collection from '~/lib/v2/collection';

const BASE_METADATA = { props: <string[]>[], key: 'id', customKeySet: false, storeKey: '' };
Object.freeze(BASE_METADATA);

export function prop(target: Model, propName: string): void {
  const ModelClass = target.constructor as typeof Model;
  ModelClass.meta.props.push(propName);
  const backingField = `_${propName}`;

  Object.defineProperty(target, propName, {
    get: function() {
      return this[backingField];
    },
    set: function(value) {
      this[backingField] = value;
      Observer.notify(this);
    },
  });
}

export function key(target: Model, propName: string): void {
  const ModelClass = target.constructor as typeof Model;
  if (ModelClass.meta.customKeySet) {
    throw new Error('Multiple custom keys not allowed');
  }

  ModelClass.meta.customKeySet = true;
  ModelClass.meta.key = propName;

  prop(target, propName);
}

type RelationOptionsSignature = {
  foreignKey: string,
}

export function belongsTo(relationName: string, options: RelationOptionsSignature) {
  return (target: Model, propName: string): void => {
    const { foreignKey } = <{ foreignKey: keyof Model }>options;

    Object.defineProperty(target, propName, {
      get: function(): Model | undefined {
        return Store.all(relationName).get(this[foreignKey]);
      },
      set: function(value: Model): void {
        const RelationModelClass = <typeof Model>value.constructor;
        const key = <keyof Model>RelationModelClass.primaryKey;
        this[foreignKey] = value[key];
        Observer.notify(this);
      },
      configurable: true,
    });
  };
}

export function hasOne(relationName: string, options: RelationOptionsSignature) {
  return (target: Model, propName: string): void => {
    const ModelClass = <typeof Model>target.constructor;
    const { foreignKey } = <{ foreignKey: keyof Model }>options;
    const primaryKey = <keyof Model>ModelClass.primaryKey;

    Object.defineProperty(target, propName, {
      get: function(): Model | undefined {
        return Store.all(relationName).findBy(model => model[foreignKey] === target[primaryKey]);
      },
      set: function(value: Model): void {
        value[foreignKey] = target[primaryKey];
        Observer.notify(this);
      },
    });
  };
}

export function hasMany(relationName: string, options: RelationOptionsSignature) {
  return (target: Model, propName: string): void => {
    const ModelClass = <typeof Model>target.constructor;
    const { foreignKey } = <{ foreignKey: keyof Model }>options;

    Object.defineProperty(target, propName, {
      get: function(): Collection<Model> {
        const ModelClass = <typeof Model>target.constructor;
        const primaryKey = <keyof Model>ModelClass.primaryKey;
        return Store.all(relationName).where({ [foreignKey]: target[primaryKey] });
      },
      set: function(values: Collection<Model>): void {
        const primaryKey = <keyof Model>ModelClass.primaryKey;
        for (const value of values) {
          value[foreignKey] = target[primaryKey];
        }
        Observer.notify(this);
      },
      configurable: true,
    });
  };
}

type ModelAttributes = Record<string, unknown>;
// TODO: static nextId method for non-custom key subclasses

export default class Model {
  private static _meta = new Map();

  // this can't be a static prop, otherwise descendents will clobber the Model static var
  // https://thecodebarbarian.com/static-properties-in-javascript-with-inheritance.html
  static get meta(): typeof BASE_METADATA {
    if (!this._meta.has(this)) {
      this._meta.set(this, { ...BASE_METADATA, props: [...BASE_METADATA.props] });
    }
    return this._meta.get(this);
  }

  static get primaryKey(): string {
    return this.meta.key;
  }

  static get props() {
    return this.meta.props;
  }

  static get storeKey() {
    if (!this.meta.storeKey) {
      throw new Error(`Model ${this.constructor.name} storeKey not set`);
    }
    return this.meta.storeKey;
  }

  // static get nextKey() {
  //   // lol
  // }

  static get all(): Collection<Model> {
    return Store.all(this.storeKey);
  }

  static where(attributes: Record<string, unknown>): Collection<Model> {
    return this.all.where(attributes);
  }

  constructor(attributes: ModelAttributes) {
    const ModelClass = this.constructor as typeof Model;
    for (const prop in attributes) {
      if (ModelClass.props.includes(prop)) {
        (this as Record<string, unknown>)[prop] = attributes[prop];
      }
    }
    Observer.notify();
  }

  static create(attributes: ModelAttributes) {
    const instance = new this(attributes);

    for (const prop in attributes) {
      if (this.props.includes(prop)) {
        (instance as Record<string, unknown>)[prop] = attributes[prop];
      }
    }
    const storeKey = this.meta.storeKey;
    Store.all(storeKey).add(instance);
    Observer.notify();
    return instance;
  }

  // get primaryKey(): string {
  //   return this[this.constructor.primaryKey];
  // }
}
