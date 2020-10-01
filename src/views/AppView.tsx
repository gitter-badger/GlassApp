import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react";
import * as React from "react";
import styled from "styled-components";
import BoolSimToggle from "../components/SimVarToggle";
import CollapseHeading from "../components/CollapseHeading";
import ColumnDiv from "../components/ColumnDiv";
import SimEventButton from "../components/SimEventButton";
import SimInput from "../components/SimInput";
import { AppModel } from "../models/app";
import { flexSpacing } from "../utils/style";
import EngineView from "./EngineView";
import LightsView from "./LightsView";
import Map from "./MapView";
import SimEventTriggerView from "./SimEventTriggerView";
import SimVarWatcherView from "./SimVarWatcherView";
import AutopilotView from "./AutopilotView";
import GroundView from "./GroundView";

export interface AppViewProps {}

const app = new AppModel();
app.startListening();

const RootDiv = styled.div`
    & {
        height: 100%;
    }
`;

const ColumnsDiv = styled.div`
    & {
        display: flex;
        flex-direction: row;
        height: 100%;

        ${flexSpacing(8, "row")}
    }
`;

const RowsDiv = styled.div`
    & {
        display: flex;
        flex-direction: column;
    }

    ${flexSpacing(2, "column")}
`;

export default observer((props: AppViewProps) => {
    const { sim } = app;

    const windDirection = sim.getData("AMBIENT WIND DIRECTION")?.value;

    return (
        <RootDiv>
            <ColumnsDiv>
                <RowsDiv>
                    <GroundView sim={sim} />
                    <AutopilotView sim={sim} />

                    <h3>External</h3>
                    <div>
                        <label title="Outside Air Temperature">OAT</label>
                        {": "}
                        {sim.getData("AMBIENT TEMPERATURE")?.value?.toFixed(2) ?? "N/A"}&deg;C
                    </div>
                    <div>
                        <label>Wind</label>
                        {": "}
                        {sim.getData("AMBIENT WIND VELOCITY")?.value?.toFixed(2) ??
                            "N/A"} knots {windDirection?.toFixed(1) ?? "N/A"}&deg;
                        <FontAwesomeIcon
                            icon={faArrowUp}
                            style={{
                                transform:
                                    windDirection != null
                                        ? `rotate(${windDirection.toFixed(2)}deg)`
                                        : undefined,
                            }}
                        />
                    </div>

                    <h3>Landing</h3>
                    <BoolSimToggle sim={sim} text="Landing Gear" varName="GEAR HANDLE POSITION" />
                </RowsDiv>
                <RowsDiv>
                    <LightsView sim={sim} />
                    <h3>COM</h3>
                    <h5>Transmit</h5>
                    <ColumnDiv>
                        {[1, 2].map(comId => (
                            <BoolSimToggle
                                key={comId}
                                sim={sim}
                                text={`COM ${comId}`}
                                varName={`COM TRANSMIT:${comId}`}
                                eventName={`COM${comId}_TRANSMIT_SELECT`}
                            />
                        ))}
                    </ColumnDiv>
                    <h3>NAV</h3>
                    {[1, 2].map(navId => (
                        <React.Fragment key={navId}>
                            <SimEventButton
                                sim={sim}
                                label={`NAV${navId} ${
                                    sim
                                        .getData(`NAV ACTIVE FREQUENCY:${navId}`)
                                        ?.value?.toFixed(2) ?? "N/A"
                                }MHz (SWAP)`}
                                event={`NAV${navId}_RADIO_SWAP`}
                            />
                            <SimInput
                                key={`nav${navId}`}
                                sim={sim}
                                formatter={v => v.toFixed(2)}
                                label={`NAV${navId} Standby Freq`}
                                dataName={`NAV STANDBY FREQUENCY:${navId}`}
                                incEvent={`NAV${navId}_RADIO_WHOLE_INC`}
                                minorIncEvent={`NAV${navId}_RADIO_FRACT_INC`}
                                decEvent={`NAV${navId}_RADIO_WHOLE_DEC`}
                                minorDecEvent={`NAV${navId}_RADIO_FRACT_DEC`}
                            />
                        </React.Fragment>
                    ))}
                </RowsDiv>
                <RowsDiv>
                    <EngineView sim={sim} />

                    <CollapseHeading defaultCollapsed title="Debug">
                        <SimVarWatcherView sim={sim} />
                        <SimEventTriggerView sim={sim} />
                    </CollapseHeading>
                </RowsDiv>
                <Map map={app.map} />
            </ColumnsDiv>
        </RootDiv>
    );
});
