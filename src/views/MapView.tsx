import { MapModel } from "../models/map";

import * as React from "react";
import { observer } from "mobx-react";
import styled, { css } from "styled-components";
import ToggleButton from "../components/ToggleButton";
import { flexSpacing } from "../utils/style";
import Button from "../components/Button";
import VerticalCollapse from "../components/VerticalCollapse";
import { fromLonLat, toLonLat } from "ol/proj";
import { getLength } from "ol/sphere";
import { arrDelete, feetToNauticalMiles } from "../utils/common";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LineString from "ol/geom/LineString";

export interface MapViewProps {
    map: MapModel;
}

const RootDiv = styled.div`
    flex: 1 1 auto;
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
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
    top: 0;
    right: 0;
    width: 200px;

    margin: 8px;

    ${flexSpacing(4, "column")}

    display: flex;
    flex-direction: column;
    align-items: stretch;
`;

const WaypointGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 2px;
`;

export default observer((props: MapViewProps) => {
    const { map } = props;

    return (
        <RootDiv>
            <MapDiv ref={map.onRef}></MapDiv>
            <ControlsDiv>
                <VerticalCollapse title="Map" defaultCollapsed>
                    <ToggleButton
                        toggled={map.followPlane}
                        onToggle={() => map.toggleFollowPlane()}
                        text="Follow Plane"
                    />
                    <ToggleButton
                        disabled={map.addingWaypoint}
                        toggled={map.showWaypoints}
                        onToggle={() => map.toggleWaypoints()}
                        text="Show Waypoints"
                    />
                </VerticalCollapse>
                {map.showWaypoints && (
                    <VerticalCollapse title="Waypoints" defaultCollapsed>
                        <ToggleButton
                            toggled={map.addingWaypoint}
                            onToggle={() =>
                                map.addingWaypoint
                                    ? map.stopAddingWaypoint()
                                    : map.startAddingWaypoint()
                            }
                            text={map.addingWaypoint ? "Placing Waypoint..." : "Place Waypoint"}
                        />
                        <WaypointGrid>
                            {map.waypoints.map(wp => (
                                <React.Fragment key={wp[0]}>
                                    <ToggleButton key={wp[0]} text={getWaypointText(wp)} />
                                    <Button onClick={() => arrDelete(map.waypoints, wp)}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </Button>
                                </React.Fragment>
                            ))}
                        </WaypointGrid>
                    </VerticalCollapse>
                )}
            </ControlsDiv>
        </RootDiv>
    );

    function getWaypointText(wp: [number, number]): string {
        const len = feetToNauticalMiles(
            new LineString([
                fromLonLat(wp),
                fromLonLat([map.planeLongitude, map.planeLatitude]),
            ]).getLength()
        );

        return `(${wp[0].toFixed(4)}, ${wp[1].toFixed(4)}) ${len.toFixed(3)}`;
    }
});
