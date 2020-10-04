import * as React from "react";
import { observer } from "mobx-react";
import styled from "styled-components";
import { ACTIVATABLE_COLOR, ACTIVE_COLOR } from "../../theme";

export interface SliderProps {
    label: string;
    value?: number;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    onChange?(value: number): void;
    format?(value: number): string;
}

const MyLabel = styled.label`
    grid-area: label;
`;

const MyValue = styled.span`
    grid-area: value;
`;

const RootDiv = styled.div<{ active?: boolean }>`
    padding: 8px;
    border-radius: 4px;
    border: solid 2px black;

    background-color: ${p => (p.active && ACTIVE_COLOR) || ACTIVATABLE_COLOR};

    display: grid;
    grid-template:
        "label . value" auto
        "input input input" auto
        / auto 1fr auto;
    gap: 8px;
`;

const MySlider = styled.input`
    grid-area: input;

    /* The slider itself */
    -webkit-appearance: none; /* Override default CSS styles */
    appearance: none;
    width: 100%; /* Full-width */
    height: 25px; /* Specified height */
    background: #d3d3d3; /* Grey background */
    border-radius: 4px;

    /* The slider handle (use -webkit- (Chrome, Opera, Safari, Edge) and -moz- (Firefox) to override default look) */
    ::-webkit-slider-thumb {
        -webkit-appearance: none; /* Override default look */
        appearance: none;
        width: 25px; /* Set a specific slider handle width */
        height: 25px; /* Slider handle height */
        background: #4caf50; /* Green background */
        cursor: pointer; /* Cursor on hover */
    }

    ::-moz-range-thumb {
        width: 25px; /* Set a specific slider handle width */
        height: 25px; /* Slider handle height */
        background: #4caf50; /* Green background */
        cursor: pointer; /* Cursor on hover */
    }
`;

export default (props: SliderProps) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const { label, min, max, value, step } = props;

    const [requested, setRequested] = React.useState<number | null>();

    React.useEffect(() => {
        const ref = inputRef.current;
        if (ref == null) return;
    }, [inputRef.current]);

    return (
        <RootDiv onClick={onDivFocus} onFocus={onDivFocus} active={requested != null}>
            <MyLabel>{label}</MyLabel>
            <MyValue>{getText()}</MyValue>
            <MySlider
                ref={inputRef}
                min={min ?? 0}
                max={max ?? 1}
                step={step ?? 0.1}
                type="range"
                disabled={props.disabled}
                onFocus={onFocus}
                onChange={onChange}
                onBlur={onBlur}
                value={requested ?? value ?? 0}
            />
        </RootDiv>
    );

    function getText() {
        const v = requested ?? value;
        if (v == null) return null;
        if (props.format != null) return props.format(v);

        return v;
    }

    function onDivFocus() {
        inputRef?.current?.focus();
    }

    function onFocus() {
        setRequested(value ?? 0);
    }

    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
        const v = event.target.valueAsNumber;
        if (Number.isNaN(v)) return;
        setRequested(v);
    }

    function onBlur() {
        if (requested != null && requested !== value) {
            props?.onChange?.(requested);
        }
        setRequested(null);
    }
};
