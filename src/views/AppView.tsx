import { observer } from "mobx-react";
import * as React from "react";
import styled from "styled-components";
import { AppModel } from "../models/app";
import { flexSpacing } from "../utils/style";
import AutopilotView from "./AutopilotView";
import ControlView from "./ControlView";
import DebugView from "./DebugView";
import EngineView from "./EngineView";
import GroundView from "./GroundView";
import LightsView from "./LightsView";
import MapView from "./MapView";
import OptionsView from "./OptionsView";

export interface AppViewProps {}

const app = new AppModel();

const RootDiv = styled.div`
    height: 100%;

    display: grid;
    grid-template-columns: repeat(3, 300px) 1fr;
    gap: 8px;
`;

const RowsDiv = styled.div`
    display: flex;
    flex-direction: column;
    overflow-y: auto;

    ${flexSpacing(2, "column")}
`;

export default observer((props: AppViewProps) => {
    const { sim } = app;

    return (
        <RootDiv>
            <RowsDiv>
                <GroundView sim={sim} />
                <ControlView sim={sim} />
                <AutopilotView sim={sim} />
            </RowsDiv>
            <RowsDiv>
                <LightsView sim={sim} />
            </RowsDiv>
            <RowsDiv>
                <EngineView sim={sim} />
                <OptionsView sim={sim} />
                <DebugView sim={sim} />
            </RowsDiv>
            <MapView sim={sim} bbox={app.blackbox} map={app.map} />
        </RootDiv>
    );
});
