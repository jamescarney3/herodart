class Observer {
  private constructor() {}

  static #instance: Observer;

  static get instance(): Observer {
    if (!Observer.#instance) Observer.#instance = new Observer();
    return Observer.#instance;
  }

  _observers = [];

  static subscribe(callback): void {
    this.instance._observers.push(callback);
  }

  static unsubscribe(callback): void {
    this.instance._observers = this.instance._observers.filter(cb => cb !== callback);
  }

  static notify(data): void {
    this.instance._observers.forEach(cb => cb(data));
  }
}

export default Observer;
