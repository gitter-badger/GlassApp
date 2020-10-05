import * as React from "react";
import { Root, Input, Label, BaseInputProps } from "./input";

/* eslint-disable @typescript-eslint/unbound-method */

export interface NumberInputProps extends BaseInputProps {
    value?: number;
    format?(value: number): string;
    onChange?(value?: number): void;
}

export default React.memo((props: NumberInputProps) => {
    const { value } = props;
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [userInput, setUserInput] = React.useState<string | null>(null);

    const textValue = React.useMemo(() => {
        if (value == null) return "";
        if (props.format != null) return props.format(value);
        return value;
    }, [props.format, value]);

    const onRootClick = React.useCallback(() => {
        // Don't refocus
        if (userInput != null) return;

        inputRef.current?.focus();
    }, [userInput]);

    const onInputKeyPress = React.useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key !== "Enter") return;

            const result = parseFloat(userInput ?? "");
            if (!Number.isNaN(result)) {
                props.onChange?.(result);
            }

            setUserInput(null);
            inputRef.current?.blur();
        },
        [userInput, props.onChange]
    );

    const onInputFocus = React.useCallback(() => {
        if (userInput != null) return;

        setUserInput(props.value?.toString() ?? "");
        inputRef.current?.select();
    }, [props.value, userInput]);

    const onInputChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setUserInput(e.target.value);
    }, []);

    const onInputBlur = React.useCallback(() => {
        if (userInput == null) return;

        const result = parseFloat(userInput);
        if (!Number.isNaN(result)) {
            props.onChange?.(result);
        }
        setUserInput(null);
    }, [userInput, props.onChange]);

    return (
        <Root onClick={onRootClick} active={userInput != null}>
            {props.label != null && <Label>{props.label}</Label>}
            <Input
                ref={inputRef}
                active={userInput != null}
                value={userInput ?? textValue}
                onFocus={onInputFocus}
                onChange={onInputChange}
                onBlur={onInputBlur}
                onKeyPress={onInputKeyPress}
                placeholder={props.placeholder}
                type={userInput != null ? "number" : "text"}
            />
        </Root>
    );
});
