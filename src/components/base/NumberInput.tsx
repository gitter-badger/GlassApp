import * as React from "react";
import styled from "styled-components";
import { ACTIVATABLE_COLOR, ACTIVE_COLOR } from "../../theme";

export interface NumberInputProps {
    value?: number;
    placeholder?: string;
    disabled?: boolean;
    label?: string;
    format?(value: number): string;
    onSubmit?(value?: number): void;
}

const RootDiv = styled.div<{ disabled?: boolean; active?: boolean }>`
    border: 2px solid black;
    border-radius: 8px;
    padding: 8px;
    display: flex;
    flex-direction: column;
    min-width: 100px;

    background-color: ${p =>
        (!p.disabled && !!p.active && ACTIVE_COLOR) ||
        (!p.disabled && ACTIVATABLE_COLOR) ||
        "white"};
`;

const MyInput = styled.input<{ active?: boolean }>`
    background-color: ${p => (p.active ? "white" : "unset")};
    border: unset;

    align-self: center;
    align-self: stretch;
    font-size: 16px;
    text-align: center;

    -webkit-outer-spin-button,
    -webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    -moz-appearance: textfield;
`;

const MyLabel = styled.label`
    align-self: center;
    margin-bottom: 4px;
`;

export default function (props: NumberInputProps) {
    const { value } = props;
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [userInput, setUserInput] = React.useState<string | null>(null);

    return (
        <RootDiv onClick={onRootClick} active={userInput != null} disabled={props.disabled}>
            {props.label != null && <MyLabel>{props.label}</MyLabel>}
            <MyInput
                ref={inputRef}
                active={userInput != null}
                value={userInput ?? getTextValue()}
                onFocus={onFocus}
                onChange={onChange}
                onBlur={onBlur}
                onSubmit={onBlur}
                onKeyPress={onKeyPress}
                placeholder={props.placeholder}
                type={userInput != null ? "number" : "text"}
            />
        </RootDiv>
    );

    function onKeyPress(e: React.KeyboardEvent) {
        if (e.key === "Enter") return submit();
    }

    function onRootClick() {
        inputRef.current?.focus();
        inputRef.current?.select();
    }

    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        setUserInput(e.target.value);
    }

    function onFocus() {
        setUserInput(props.value?.toString() ?? "");
    }

    function onBlur() {
        submit();
    }

    function getTextValue() {
        if (value == null) return "";

        if (props.format != null) return props.format(value);

        return value;
    }

    function submit() {
        if (userInput == null) return;

        const result = parseFloat(userInput);
        if (!Number.isNaN(result)) {
            props.onSubmit?.(result);
        }

        setUserInput(null);
        inputRef.current?.blur();
    }
}
