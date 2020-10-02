import { action, observable } from "mobx";

interface StoredConstructorArgs<T> {
    key: string;
    initial: T;

    serialize(value: T): string;
    deserialize(value: string): T;
}

export class Stored<T> {
    @observable
    private _value: T;

    private _key: string;
    private _serialize: (value: T) => string;
    private _deserialize: (value: string) => T;

    constructor(args: StoredConstructorArgs<T>) {
        this._key = args.key;
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
        localStorage.setItem(this._key, val);
    }

    private getFromStorage(): T | undefined {
        const foundItem = localStorage.getItem(this._key);
        if (foundItem == null) return undefined;
        try {
            const result = this._deserialize(foundItem);
            return result;
        } catch {
            return undefined;
        }
    }
}
