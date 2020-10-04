import { observer } from "mobx-react";
import * as React from "react";
import styled from "styled-components";
import { AppModel } from "../models/app";
import { flexSpacing } from "../utils/style";
import AutopilotView from "./AutopilotView";
import ControlView from "./ControlView";
import DebugView from "./DebugView";
import EngineView from "./EngineView";
import GreetingView from "./GreetingView";
import GroundView from "./GroundView";
import LightsView from "./LightsView";
import MapView from "./MapView";
import OptionsView from "./OptionsView";
import StatusView from "./StatusView";

export interface AppViewProps {}

const app = new AppModel();

const RootDiv = styled.div`
    height: 100%;

    display: grid;

    grid-template-columns: repeat(3, 1fr) 500px;

    @media only screen and (min-width: 1080px) {
        grid-template-columns: repeat(3, 300px) auto;
    }

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
            {app.showGreeting.get() && <GreetingView app={app} />}
            <RowsDiv>
                <StatusView sim={sim} />
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
