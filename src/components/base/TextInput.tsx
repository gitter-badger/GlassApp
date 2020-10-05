import * as React from "react";
import { Input, Root, Label, BaseInputProps } from "./input";

/* eslint-disable @typescript-eslint/unbound-method */

export interface TextInputProps extends BaseInputProps {
    value?: string;
    format?(value: string): string;
    onChange?(value: string): void;
}

export default React.memo((props: TextInputProps) => {
    const { value } = props;
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [userInput, setUserInput] = React.useState<string | null>(null);

    const textValue = React.useMemo(() => {
        if (value == null) return "";
        if (props.format != null) return props.format(value);
        return value;
    }, [value, props.format]);

    const onRootClick = React.useCallback(() => {
        // Don't refocus
        if (userInput != null) return;

        inputRef.current?.focus();
    }, [userInput]);

    const onInputChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setUserInput(e.target.value);
    }, []);

    const onInputFocus = React.useCallback(() => {
        // Don't refocus
        if (userInput != null) return;

        // Reset user input
        inputRef.current?.select();
        setUserInput(props.value?.toString() ?? "");
    }, [props.value, userInput]);

    const onInputKeyPress = React.useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key !== "Enter") return;
            if (userInput == null) return;
            props.onChange?.(userInput);
            setUserInput(null);
        },
        [userInput, props.onChange]
    );

    const onInputBlur = React.useCallback(() => {
        if (userInput == null) return;
        props.onChange?.(userInput);
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
                type="text"
            />
        </Root>
    );
});
