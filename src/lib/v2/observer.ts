class Observer {
  private constructor() {}

  static #instance: Observer;

  static get instance(): Observer {
    if (!Observer.#instance) Observer.#instance = new Observer();
    return Observer.#instance;
  }

  _observers = new Set();

  static subscribe(callback): void {
    this.instance._observers.add(callback);
  }

  static unsubscribe(callback): void {
    this.instance._observers.delete(callback);
  }

  static notify(data): void {
    [...this.instance._observers].forEach(cb => cb(data));
  }
}

export default Observer;
