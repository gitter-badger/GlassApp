import * as React from "react";
import styled, { css } from "styled-components";
import { ACTIVATABLE_COLOR, ACTIVE_COLOR } from "../../theme";

/* eslint-disable @typescript-eslint/unbound-method */

export interface SliderProps {
    label: React.ReactNode;
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
    user-select: none;
`;

const MyValue = styled.span`
    grid-area: value;
    user-select: none;
`;

const ActiveBackground = css`
    background-color: ${ACTIVE_COLOR};
`;

const RootDiv = styled.div<{ active?: boolean }>`
    padding: 8px;
    border-radius: 16px;
    border: solid 2px black;

    display: grid;
    grid-template:
        "label . value" auto
        "input input input" auto
        / auto 1fr auto;
    gap: 8px;
`;

const SliderThumb = css`
    border-radius: 15px;
    width: 30px; /* Set a specific slider handle width */
    height: 30px; /* Slider handle height */
    background: ${ACTIVATABLE_COLOR}; /* Green background */

    cursor: pointer; /* Cursor on hover */
`;

const SliderThumbActive = css`
    ${ActiveBackground}
`;

const MySlider = styled.input<{ active?: boolean }>`
    grid-area: input;

    /* The slider itself */
    -webkit-appearance: none; /* Override default CSS styles */
    appearance: none;
    width: 100%; /* Full-width */
    height: 32px; /* Specified height */
    background-color: #d3d3d3; /* Grey background */
    border-radius: 32px;

    box-shadow: 0 5px 5px -5px #333 inset;

    /* The slider handle (use -webkit- (Chrome, Opera, Safari, Edge) and -moz- (Firefox) to override default look) */
    ::-webkit-slider-thumb {
        -webkit-appearance: none; /* Override default look */
        appearance: none;
        ${SliderThumb}
        ${p => p.active && SliderThumbActive}
    }

    ::-moz-range-thumb {
        ${SliderThumb}
        ${p => p.active && SliderThumbActive}
    }
`;

export default React.memo((props: SliderProps) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const { label, min, max, value, step } = props;

    const [requested, setRequested] = React.useState<number | null>();

    const text = React.useMemo(() => {
        const v = requested ?? value;

        if (v == null) return null;
        if (props.format != null) return props.format(v);

        return v;
    }, [requested, value, props.format]);

    const onSliderFocus = React.useCallback(() => {
        setRequested(value ?? 0);
    }, [value]);

    const onSliderChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const v = event.target.valueAsNumber;
        if (Number.isNaN(v)) return;
        setRequested(v);
    }, []);

    const onSliderBlur = React.useCallback(() => {
        if (requested != null && requested !== value) {
            props.onChange?.(requested);
        }
        setRequested(null);
    }, [requested, value, props.onChange]);

    return (
        <RootDiv>
            <MyLabel>{label}</MyLabel>
            <MyValue>{text}</MyValue>
            <MySlider
                active={requested != null}
                ref={inputRef}
                min={min ?? 0}
                max={max ?? 1}
                step={step ?? 0.1}
                type="range"
                disabled={props.disabled}
                onFocus={onSliderFocus}
                onChange={onSliderChange}
                onBlur={onSliderBlur}
                value={requested ?? value ?? 0}
            />
        </RootDiv>
    );
});
