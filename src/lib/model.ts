import Store from '~/lib/store';
import { hasOwnOrInhertits } from '~/lib/utils';

export function prop(target, propName): void {
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

export function key(target, propName): void {
  target._key = propName;
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

export function belongsTo(relation: string, options) {
  return function(target: Model, propName: string): void {
    const { foreignKey } = options;
    const backingField = `_${foreignKey}`;

    Object.defineProperty(target, propName, {
      get: function() {
        const relationCollection = Store._data[relation];
        return relationCollection.find(this[backingField]);
      },
      set: function(value) {
        this[backingField] = value[value.constructor._key];
      }
    });
  };
}

export function hasMany(relation: string, options) {
  return function(target: Model, propName: string): void {
    const instanceKey = target._key;
    const { foreignKey } = options;
    const backingField = `_${foreignKey}`;

    Object.defineProperty(target, propName, {
      get: function() {
        const relationCollection = Store._data[relation];
        return relationCollection.filter((member) => {
          const key = this.constructor._key;
          return member[backingField] === this[key];
        });
      },
      set: function(values) {
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

export function observed (target, methodName, descriptor) {
  const method = descriptor.value;
  descriptor.value = function (...args) {
    const result = method.apply(this, args);
    if (this.observe) this.observe(this);
    return result;
  };
}

export default class Model {
  @prop declare observe: () => void;

  constructor(attributes) {
    for (const prop in attributes) {
      if (hasOwnOrInhertits(this, prop)) {
        this[prop] = attributes[prop];
      }
    }
  }

  static create(attributes) {
    const instance = new this(attributes);
    Store._data[instance._storeKey].add(instance);
    return instance;
  }
}
