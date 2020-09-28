import { observer } from "mobx-react";
import * as React from "react";
import styled from "styled-components";
import { SimModel } from "../models/sim";
import { ACTIVE_COLOR } from "../theme";

const RootDiv = styled.div`
    padding: 4px;
    border: 2px solid black;
`;

const Button = styled.button`
    background-color: ${ACTIVE_COLOR};
    border: 2px solid black;
`;

export interface SimInputProps {
    sim: SimModel;
    label: string;
    dataName: string;
    formatter?: (value: number) => string | number;

    incEvent?: string;
    minorIncEvent?: string;
    decEvent?: string;
    minorDecEvent?: string;
}

export default observer((props: SimInputProps) => {
    const { sim, incEvent, decEvent, minorIncEvent, minorDecEvent, formatter } = props;
    const val = sim.getData(props.dataName)?.value;

    const output = val != null && formatter != null ? formatter(val) : val;

    return (
        <RootDiv>
            <label>{props.label}</label>
            <br />
            <input type="number" readOnly value={output} />

            {decEvent && <Button onClick={() => sim.sendEvent(decEvent)}>DEC</Button>}
            {minorDecEvent && <Button onClick={() => sim.sendEvent(minorDecEvent)}>dec</Button>}
            {minorIncEvent && <Button onClick={() => sim.sendEvent(minorIncEvent)}>inc</Button>}
            {incEvent && <Button onClick={() => sim.sendEvent(incEvent)}>INC</Button>}
        </RootDiv>
    );
});
