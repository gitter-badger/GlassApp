import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react";
import * as React from "react";
import styled from "styled-components";
import BoolSimDataToggle from "../components/BoolSimDataToggle";
import SimDataInput from "../components/SimDataInput";
import { AppModel } from "../models/AppModel";
import { flexSpacing } from "../utils/style";
import Map from "./MapView";

export interface AppViewProps {}

const app = new AppModel();

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

    React.useEffect(() => {
        app.startListening();
    }, []);

    const windDirection = sdm.getData("AMBIENT WIND DIRECTION")?.value;

    return (
        <RootDiv>
            <ColumnsDiv>
                <RowsDiv>
                    <h3>Lights</h3>
                    <BoolSimDataToggle sdm={sdm} label="Taxi" name="LIGHT TAXI" />
                    <BoolSimDataToggle sdm={sdm} label="Beacon" name="LIGHT BEACON" />
                    <BoolSimDataToggle sdm={sdm} label="Navigation" name="LIGHT NAV" />
                    <BoolSimDataToggle sdm={sdm} label="Landing" name="LIGHT LANDING" />
                    <BoolSimDataToggle sdm={sdm} label="Strobe" name="LIGHT STROBE" />
                    <BoolSimDataToggle sdm={sdm} label="Logo" name="LIGHT LOGO" />
                    <BoolSimDataToggle sdm={sdm} label="Cabin" name="LIGHT CABIN" />
                    <BoolSimDataToggle sdm={sdm} label="Panel" name="LIGHT PANEL" />

                    {sdm.isDataTrue("AUTOPILOT AVAILABLE") && (
                        <React.Fragment>
                            <h3>Autopilot</h3>
                            <BoolSimDataToggle
                                sdm={sdm}
                                label="Autopilot"
                                name="AUTOPILOT MASTER"
                            />
                            <BoolSimDataToggle
                                sdm={sdm}
                                label="Nav Lock"
                                name="AUTOPILOT NAV1 LOCK"
                            />
                            <BoolSimDataToggle
                                sdm={sdm}
                                label="Heading Lock"
                                name="AUTOPILOT HEADING LOCK"
                            />
                            <BoolSimDataToggle
                                sdm={sdm}
                                label="Altitude Lock"
                                name="AUTOPILOT ALTITUDE LOCK"
                            />
                            <BoolSimDataToggle
                                sdm={sdm}
                                label="Attitude Hold"
                                name="AUTOPILOT ATTITUDE HOLD"
                            />
                            <BoolSimDataToggle
                                sdm={sdm}
                                label="Vertical Hold"
                                name="AUTOPILOT VERTICAL HOLD"
                            />
                            <SimDataInput
                                sdm={sdm}
                                label="Vertical Speed"
                                name="AUTOPILOT VERTICAL HOLD VAR"
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
                    <BoolSimDataToggle sdm={sdm} label="Landing Gear" name="GEAR HANDLE POSITION" />
                    <BoolSimDataToggle
                        sdm={sdm}
                        label="Parking Brake"
                        name="BRAKE PARKING POSITION"
                    />
                </RowsDiv>
                <RowsDiv>
                    <h3>NAV</h3>
                    <BoolSimDataToggle sdm={sdm} label="COM TRANSMIT 1" name="COM TRANSMIT:1" />
                    <BoolSimDataToggle sdm={sdm} label="COM TRANSMIT 2" name="COM TRANSMIT:2" />

                    <SimDataInput sdm={sdm} label="COM ACTIVE 1" name="COM ACTIVE FREQUENCY:1" />
                    <SimDataInput sdm={sdm} label="COM ACTIVE 2" name="COM ACTIVE FREQUENCY:2" />
                    <SimDataInput sdm={sdm} label="COM STANDBY 1" name="COM STANDBY FREQUENCY:1" />
                    <SimDataInput sdm={sdm} label="COM STANDBY 2" name="COM STANDBY FREQUENCY:2" />

                    <SimDataInput sdm={sdm} label="NAV ACTIVE 1" name="NAV ACTIVE FREQUENCY:1" />
                    <SimDataInput sdm={sdm} label="NAV ACTIVE 2" name="NAV ACTIVE FREQUENCY:2" />
                    <SimDataInput sdm={sdm} label="NAV STANDBY 1" name="NAV STANDBY FREQUENCY:1" />
                    <SimDataInput sdm={sdm} label="NAV STANDBY 2" name="NAV STANDBY FREQUENCY:2" />
                </RowsDiv>
                <Map map={app.map} />
            </ColumnsDiv>
        </RootDiv>
    );
});
