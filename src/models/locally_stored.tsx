import { action, observable } from "mobx";

export interface StoredConstructorArgs<T> {
    domain: string;
    name: string;
    initial: T;

    serialize(value: T): string;
    deserialize(value: string): T;
}

/**
 * A value retrieved from and saved into LocalStorage.
 */
export class LocallyStored<T> {
    @observable
    private _value: T;

    private _domain: string;
    private _name: string;
    private _serialize: (value: T) => string;
    private _deserialize: (value: string) => T;

    constructor(args: StoredConstructorArgs<T>) {
        this._domain = args.domain;
        this._name = args.name;

        this._serialize = args.serialize.bind(args);
        this._deserialize = args.deserialize.bind(args);

        this._value = this.getFromStorage() ?? args.initial;
        this.saveToStorage(this._value);
    }

    get(): T {
        return this._value;
    }

    @action
    set(value: T): void {
        this._value = value;
        this.saveToStorage(this._value);
    }

    private saveToStorage(value: T): void {
        const val = this._serialize(value);
        localStorage.setItem(this.getKey(), val);
    }

    private getFromStorage(): T | undefined {
        const foundItem = localStorage.getItem(this.getKey());
        if (foundItem == null) return undefined;
        try {
            const result = this._deserialize(foundItem);
            return result;
        } catch {
            return undefined;
        }
    }

    private getKey(): string {
        return `${this._domain}:${this._name}`;
    }
}
