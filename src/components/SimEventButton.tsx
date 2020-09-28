import { observer } from "mobx-react";
import * as React from "react";
import styled from "styled-components";
import { SimModel } from "../models/sim";
import { ACTIVE_COLOR, ACTIVE_HOVER_COLOR } from "../theme";
import ToggleButton from "./ToggleButton";

export interface SimEventButtonProps {
    sim: SimModel;
    label: string;
    event: string;
    disabled?: boolean;
}

const RootButton = styled.button`
    & {
        padding: 8px;
        border: 2px solid black;
        background-color: ${ACTIVE_COLOR};
    }

    &:hover {
        background-color: ${ACTIVE_HOVER_COLOR};
    }
`;

export default React.memo((props: SimEventButtonProps) => {
    const { label, sim, event } = props;
    return <RootButton onClick={() => sim.sendEvent(event)}>{label}</RootButton>;
});
