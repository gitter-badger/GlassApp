import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react";
import * as React from "react";
import styled from "styled-components";
import BoolSimToggle from "../components/BoolSimToggle";
import SimEventButton from "../components/SimEventButton";
import SimInput from "../components/SimInput";
import { AppModel } from "../models/AppModel";
import { flexSpacing } from "../utils/style";
import Map from "./MapView";

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
    const { sdm } = app;

    const windDirection = sdm.getData("AMBIENT WIND DIRECTION")?.value;

    return (
        <RootDiv>
            <ColumnsDiv>
                <RowsDiv>
                    {sdm.isDataTrue("SIM ON GROUND") && (
                        <React.Fragment>
                            <h3>Ground</h3>
                            <SimEventButton
                                sdm={sdm}
                                event="REQUEST_FUEL_KEY"
                                label="Request Fuel"
                            />
                            <SimEventButton sdm={sdm} event="TOGGLE_PUSHBACK" label="Pushback" />
                            <BoolSimToggle
                                sdm={sdm}
                                label="Parking Brake"
                                dataName="BRAKE PARKING POSITION"
                                eventName="PARKING_BRAKES"
                            />
                        </React.Fragment>
                    )}

                    <h3>Lights</h3>
                    <BoolSimToggle sdm={sdm} label="Taxi" dataName="LIGHT TAXI" />
                    <BoolSimToggle sdm={sdm} label="Beacon" dataName="LIGHT BEACON" />
                    <BoolSimToggle sdm={sdm} label="Navigation" dataName="LIGHT NAV" />
                    <BoolSimToggle sdm={sdm} label="Landing" dataName="LIGHT LANDING" />
                    <BoolSimToggle sdm={sdm} label="Strobe" dataName="LIGHT STROBE" />
                    <BoolSimToggle sdm={sdm} label="Logo" dataName="LIGHT LOGO" />
                    <BoolSimToggle sdm={sdm} label="Cabin" dataName="LIGHT CABIN" />
                    <BoolSimToggle sdm={sdm} label="Panel" dataName="LIGHT PANEL" />

                    {sdm.isDataTrue("AUTOPILOT AVAILABLE") && (
                        <React.Fragment>
                            <h3>Autopilot</h3>
                            <BoolSimToggle
                                sdm={sdm}
                                label="Autopilot"
                                dataName="AUTOPILOT MASTER"
                            />
                            <BoolSimToggle
                                sdm={sdm}
                                label="Nav Lock"
                                dataName="AUTOPILOT NAV1 LOCK"
                            />
                            <BoolSimToggle
                                sdm={sdm}
                                label="Heading Lock"
                                dataName="AUTOPILOT HEADING LOCK"
                            />
                            <BoolSimToggle
                                sdm={sdm}
                                label="Altitude Lock"
                                dataName="AUTOPILOT ALTITUDE LOCK"
                            />
                            <BoolSimToggle
                                sdm={sdm}
                                label="Attitude Hold"
                                dataName="AUTOPILOT ATTITUDE HOLD"
                            />
                            <BoolSimToggle
                                sdm={sdm}
                                label="Vertical Hold"
                                dataName="AUTOPILOT VERTICAL HOLD"
                            />
                            <SimInput
                                sdm={sdm}
                                label="Vertical Hold Speed"
                                dataName="AUTOPILOT VERTICAL HOLD VAR"
                                incEvent="AP_VS_VAR_INC"
                                decEvent="AP_VS_VAR_DEC"
                            />
                        </React.Fragment>
                    )}

                    <h3>External</h3>
                    <div>
                        <label title="Outside Air Temperature">OAT</label>
                        {": "}
                        {sdm.getData("AMBIENT TEMPERATURE")?.value?.toFixed(2) ?? "N/A"}&deg;C
                    </div>
                    <div>
                        <label>Wind</label>
                        {": "}
                        {sdm.getData("AMBIENT WIND VELOCITY")?.value?.toFixed(2) ??
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
                    <BoolSimToggle sdm={sdm} label="Landing Gear" dataName="GEAR HANDLE POSITION" />
                </RowsDiv>
                <RowsDiv>
                    <h3>COM</h3>
                    {[1, 2].map(comId => (
                        <BoolSimToggle
                            key={comId}
                            sdm={sdm}
                            label={`COM TRANSMIT ${comId}`}
                            dataName={`COM TRANSMIT:${comId}`}
                            eventName={`COM${comId}_TRANSMIT_SELECT`}
                        />
                    ))}
                    <h3>NAV</h3>
                    {[1, 2].map(navId => (
                        <React.Fragment key={navId}>
                            <SimEventButton
                                sdm={sdm}
                                label={`NAV${navId} ${
                                    sdm
                                        .getData(`NAV ACTIVE FREQUENCY:${navId}`)
                                        ?.value?.toFixed(2) ?? "N/A"
                                }MHz (SWAP)`}
                                event={`NAV${navId}_RADIO_SWAP`}
                            />
                            <SimInput
                                key={`nav${navId}`}
                                sdm={sdm}
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
                <Map map={app.map} />
            </ColumnsDiv>
        </RootDiv>
    );
});
