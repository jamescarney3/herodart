import Store from '~/lib/store';
import { hasOwnOrInherits } from '~/lib/utils';

export function prop(target: Model, propName: string): void {
  const backingField = `_${propName}`;
  Object.defineProperty(target, propName, {
    get: function() {
      return this[backingField];
    },
    set: function(value) {
      this[backingField] = value;
    },
  });
}

export function key(target: Model, propName: string): void {
  // casting this here since we know _key is a static property that can be set
  // on a descendent of Model
  (target as Model & { _key: string })._key = propName;
  const backingField = `_${propName}`;
  Object.defineProperty(target, propName, {
    get: function() {
      return this[backingField];
    },
    set: function(value) {
      this[backingField] = value;
    },
  });
}

type RelationSignature = { foreignKey: string };

export function belongsTo(relation: string, options: RelationSignature) {
  return function(target: Model, propName: string): void {
    const { foreignKey } = options;
    const backingField = `_${foreignKey}`;

    Object.defineProperty(target, propName, {
      get: function() {
        const relationCollection = Store._data[relation];
        return relationCollection.get(this[backingField]);
      },
      set: function(value) {
        this[backingField] = value[value.constructor._key];
      }
    });
  };
}

export function hasMany(relation: string, options: RelationSignature) {
  return function(target: Model, propName: string): void {
    const { foreignKey } = options;
    const backingField = `_${foreignKey}`;

    Object.defineProperty(target, propName, {
      get: function() {
        // casting this here since we know _key is a static property that can be set
        // on a descendent of Model
        const instanceKey = (target as  Model & { _key: string })._key;
        const relationCollection = Store._data[relation];
        return relationCollection.filter((member) => {
          return member[backingField] === this[instanceKey];
        });
      },
      set: function(values) {
        // casting this here since we know _key is a static property that can be set
        // on a descendent of Model
        const instanceKey = (target as  Model & { _key: string })._key;
        const relationCollection = Store._data[relation];
        for (const relationMember of relationCollection) {
          if (values.includes(relationMember)) {
            relationMember[backingField] = this[instanceKey];
          } else {
            if (relationMember[backingField] === this[instanceKey]) {
              delete relationMember[backingField];
            }
          }
        }

        for (const valueMember of values) {
          if (!relationCollection.includes(valueMember)) {
            valueMember[backingField] = this[instanceKey];
            relationCollection.add(valueMember);
          }
        }
      }
    });
  };
}


export function observed (_target: Model, _methodName: string, descriptor: PropertyDescriptor) {
  const method = descriptor.value;
  descriptor.value = function(...args: unknown[]) {
    const result = method.apply(this, args);
    const observe = (<Model>this).observe;
    if (observe) observe();
    return result;
  };
}

type ModelAttributes = Record<string, unknown>;

export default class Model {
  static _key: string | null =  null;
  declare static _storeKey: string;

  @prop declare observe: () => void;

  constructor(attributes: ModelAttributes) {
    for (const prop in attributes) {
      if (hasOwnOrInherits(this, prop)) {
        (this as unknown as {[key: string]: unknown})[prop] = attributes[prop];
      }
    }
  }

  static create(attributes: ModelAttributes): Model {
    const instance = new this(attributes);
    Store._data[(instance as unknown as typeof Model)._storeKey].add(instance);
    return instance;
  }
}
