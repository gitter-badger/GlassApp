import { action, observable } from "mobx";
import { SimpleValue, SimpleValueConstructorArgs } from "./simple_value";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SimpleBooleanConstructorArgs extends SimpleValueConstructorArgs<boolean> {}

export class SimpleBoolean extends SimpleValue<boolean> {
    constructor(args: SimpleBooleanConstructorArgs) {
        super(args);
    }

    @action.bound
    toggle(): void {
        this.value = !this.value;
    }
}
