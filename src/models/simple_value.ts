import { action, observable } from "mobx";
export interface SimpleValueConstructorArgs<T> {
    initial: T;
}

export class SimpleValue<T> {
    @observable
    value: T;

    constructor(args: SimpleValueConstructorArgs<T>) {
        this.value = args.initial;
    }

    @action.bound
    set(value: T): void {
        this.value = value;
    }

    @action.bound
    update(getValue: (prevValue: T) => T): void {
        this.value = getValue(this.value);
    }
}
