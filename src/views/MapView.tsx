import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react";
import * as React from "react";
import styled from "styled-components";
import Button from "../components/base/Button";
import ToggleButton from "../components/base/Toggle";
import VerticalCollapse from "../components/VerticalCollapse";
import BlackboxModel from "../models/blackbox";
import { MapModel } from "../models/map";
import { SimModel } from "../models/sim";
import { radToDeg } from "../utils/common";
import { flexSpacing } from "../utils/style";

export interface MapViewProps {
    map: MapModel;
    bbox: BlackboxModel;
    sim: SimModel;
}

const RootDiv = styled.div`
    flex: 1 1 auto;
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;

    resize: horizontal;
    border-left: 3px black solid;
`;

const MapDiv = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
`;

const ControlsDiv = styled.div`
    position: absolute;
    top: 8px;
    right: 8px;

    ${flexSpacing(4, "row")}

    pointer-events: none;

    display: flex;
    flex-direction: row;
    align-items: stretch;
`;

const BottomRightOverlay = styled.div`
    position: absolute;
    bottom: 8px;
    right: 8px;

    ${flexSpacing(4, "row")}

    pointer-events: none;

    display: flex;
    flex-direction: row;
    align-items: stretch;
`;

const EnvironmentDiv = styled.div`
    display: grid;
    grid-template-columns: 1fr auto;
    background-color: hsla(0, 0%, 100%, 50%);
    padding: 8px;
    gap: 2px;
`;

const Column = styled.div`
    display: flex;
    width: 150px;
    flex-direction: column;
    align-items: stretch;

    pointer-events: none;
    * {
        pointer-events: auto;
    }

    ${flexSpacing(4, "column")}
`;

export default observer((props: MapViewProps) => {
    const { map, bbox, sim } = props;

    const oat = sim.getData("AMBIENT TEMPERATURE")?.value;
    const oatText = oat != null ? `${oat.toFixed(2)}°C` : "N/A";

    const windVelocity = sim.getData("AMBIENT WIND VELOCITY")?.value;
    const windVelocityText = windVelocity != null ? `${Math.round(windVelocity)} kts` : "N/A";
    const windDirection = sim.getData("AMBIENT WIND DIRECTION")?.value ?? 0;
    const windDirectionText = `${Math.round(windDirection)}°`;
    const windDirectionTransform = `rotate(${Math.round(
        radToDeg(map.view.getRotation()) + windDirection
    )}deg)`;

    return (
        <RootDiv>
            <MapDiv ref={map.onRef}></MapDiv>
            <ControlsDiv>
                <Column>
                    <VerticalCollapse title="Map" defaultCollapsed>
                        <Button onClick={() => map.resetNorth()}>Reset North</Button>
                    </VerticalCollapse>
                </Column>
                <Column>
                    <VerticalCollapse title="Plane" defaultCollapsed>
                        <ToggleButton
                            active={map.followPlane}
                            onClick={() => map.toggleFollowPlane()}
                            text="Follow Location"
                        />
                        <ToggleButton
                            active={map.followHeading}
                            onClick={() => map.toggleFollowPlaneHeading()}
                            text="Follow Heading"
                        />
                    </VerticalCollapse>
                </Column>
                <Column>
                    <VerticalCollapse title="Blackbox" defaultCollapsed>
                        <ToggleButton
                            active={bbox.logging}
                            onClick={() =>
                                bbox.logging ? bbox.stopLogging() : bbox.startLogging()
                            }
                            text={bbox.logging ? "Logging..." : "Log Flight"}
                        />
                        <Button onClick={() => bbox.clearLog()}>Clear Log</Button>
                        <ToggleButton
                            active={map.showLog}
                            onClick={() => map.toggleShowLog()}
                            text="Display Log"
                        />
                        <Button onClick={() => bbox.downloadLog()}>Download</Button>
                    </VerticalCollapse>
                </Column>
            </ControlsDiv>
            <BottomRightOverlay>
                <Column>
                    <VerticalCollapse title="Environment">
                        <EnvironmentDiv>
                            <label title="Outside Air Temperature">OAT</label>
                            <span>{oatText}</span>
                            <label>Wind Spd</label>
                            <span>{windVelocityText}</span>
                            <label>Wind Dir</label>
                            <div>
                                <span>{windDirectionText}</span>
                                <FontAwesomeIcon
                                    icon={faArrowUp}
                                    style={{
                                        transform: windDirectionTransform,
                                    }}
                                />
                            </div>
                        </EnvironmentDiv>
                    </VerticalCollapse>
                </Column>
            </BottomRightOverlay>
        </RootDiv>
    );
});
