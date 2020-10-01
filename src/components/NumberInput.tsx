import * as React from "react";
import styled from "styled-components";
import { ACTIVE_COLOR, ACTIVE_HOVER_COLOR, DISABLED_COLOR } from "../theme";

export interface NumberInputProps {
    value?: number;
    placeholder?: string;
    disabled?: boolean;
    label?: string;
    format?(value: number): string;
    onSubmit?(value?: number): void;
}

const RootDiv = styled.div<{ disabled?: boolean; focused?: boolean }>`
    border: 2px solid black;
    background-color: ${p => (p.disabled ? DISABLED_COLOR : ACTIVE_COLOR)};
    border-radius: 4px;
    padding: 8px;
    display: flex;
    flex-direction: column;
    min-width: 100px;

    :hover {
        background-color: ${ACTIVE_HOVER_COLOR};
    }
`;

const MyInput = styled.input<{ focused?: boolean }>`
    background-color: ${p => (p.focused ? "white" : "unset")};
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
        <RootDiv onClick={onRootClick} disabled={props.disabled}>
            {props.label != null && <MyLabel>{props.label}</MyLabel>}
            <MyInput
                ref={inputRef}
                focused={userInput != null}
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

        const result = parseFloat(userInput);
        if (!Number.isNaN(result)) {
            props.onSubmit?.(result);
        }

        setUserInput(null);
    }

    function getTextValue() {
        if (value == null) return "";

        if (props.format != null) return props.format(value);

        return value;
    }
}
