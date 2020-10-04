import * as React from "react";
import styled from "styled-components";
import { ACTIVE_COLOR, ACTIVATABLE_COLOR } from "../../theme";

export interface StringInputProps {
    value?: string;
    placeholder?: string;
    disabled?: boolean;
    label?: string;
    format?(value: string): string;
    onSubmit?(value?: string): void;
}

const RootDiv = styled.div<{ active?: boolean }>`
    background-color: ${p => (p.active ? ACTIVE_COLOR : ACTIVATABLE_COLOR)};
    border: 2px solid black;
    border-radius: 4px;
    padding: 8px;
    display: flex;
    flex-direction: column;
    min-width: 100px;
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

export default function (props: StringInputProps) {
    const { value } = props;
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [userInput, setUserInput] = React.useState<string | null>(null);

    return (
        <RootDiv onClick={onRootClick} active={userInput != null}>
            {props.label != null && <MyLabel>{props.label}</MyLabel>}
            <MyInput
                ref={inputRef}
                active={userInput != null}
                value={userInput ?? getTextValue()}
                onFocus={onFocus}
                onChange={onChange}
                onBlur={onBlur}
                onSubmit={onBlur}
                placeholder={props.placeholder}
                type="text"
            />
        </RootDiv>
    );

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
        if (userInput == null) return;
        props.onSubmit?.(userInput);
        setUserInput(null);
    }

    function getTextValue() {
        if (value == null) return "";

        if (props.format != null) return props.format(value);

        return value;
    }
}
