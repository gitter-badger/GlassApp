import { faCheckSquare, faSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react";
import * as React from "react";
import styled from "styled-components";
import { SimModel } from "../models/sim";
import { DISABLED_COLOR, ENABLED_COLOR } from "../theme";

export interface SimBoolIndicatorProps {
    sim: SimModel;
    text: string;
    dataName: string;
    threshold?: number;
}

const RootDiv = styled.div`
    border: 1px solid black;
    border-radius: 2px;
    padding: 4px;
    text-align: center;
`;

export default observer((props: SimBoolIndicatorProps) => {
    const { sim, text, dataName, threshold } = props;
    const def = sim.getData(dataName);
    const active = (def?.value ?? 0) > (threshold ?? 0.5);
    return (
        <RootDiv style={{ backgroundColor: active ? ENABLED_COLOR : DISABLED_COLOR }}>
            <FontAwesomeIcon icon={active ? faCheckSquare : faSquare} /> {text}
        </RootDiv>
    );
});
