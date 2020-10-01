import { SimModel } from "../models/sim";
import * as React from "react";
import { observer } from "mobx-react";
import styled from "styled-components";

interface SimSliderProps {
    sim: SimModel;
    text: string;
    dataName: string;
    min?: number;
    max?: number;
}

const RootDiv = styled.div`
    display: flex;
    flex-direction: column;
`;

const MySlider = styled.input``;

export default observer((props: SimSliderProps) => {
    const { sim, dataName, text, min, max } = props;

    const def = sim.getData(dataName);
    const [isSliding, setSliding] = React.useState(false);
    const [requested, setRequested] = React.useState(0);

    const displayedValue = isSliding ? requested : def?.value;

    return (
        <RootDiv>
            <label>
                {text}: {def?.value.toFixed(2)}
            </label>
            <MySlider
                min={min ?? 0}
                max={max ?? 1}
                type="range"
                disabled={displayedValue == null}
                onPointerDown={onSlidingStart}
                onChange={onChange}
                onPointerUp={onSlidingEnd}
                value={displayedValue}
            />
        </RootDiv>
    );

    function onSlidingStart() {
        setSliding(true);
    }

    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
        const value = parseFloat(event.target.value);
        if (Number.isNaN(value)) return;
        setRequested(value);
    }

    function onSlidingEnd() {
        sim.setData(dataName, requested);
        setSliding(false);
    }
});
