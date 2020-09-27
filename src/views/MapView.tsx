import { MapModel } from "../models/MapModel";

import * as React from "react";
import { observer } from "mobx-react";
import styled, { css } from "styled-components";
import ToggleButton from "../components/ToggleButton";
import { flexSpacing } from "../utils/style";

export interface MapViewProps {
    map: MapModel;
}

const RootDiv = styled.div`
    & {
        flex: 1 1 auto;
        position: relative;
        overflow: hidden;
    }
`;

const MapDiv = styled.div`
    & {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
    }
`;

const ControlsDiv = styled.div`
    position: absolute;
    top: 0;
    right: 0;

    margin: 8px;

    ${flexSpacing(4, "column")}

    display: flex;
    flex-direction: column;
    align-items: flex-end;
`;

export default observer((props: MapViewProps) => {
    const { map } = props;

    return (
        <RootDiv>
            <MapDiv ref={map.onRef}></MapDiv>
            <ControlsDiv>
                <ToggleButton
                    toggled={map.followPlane}
                    onToggle={() => map.toggleFollowPlane()}
                    text="Follow Plane"
                />
                <ToggleButton
                    disabled={map.placingPin}
                    toggled={map.showPin}
                    onToggle={() => map.toggleShowPin()}
                    text="Show Pin"
                />
                {map.showPin && (
                    <ToggleButton
                        toggled={map.placingPin}
                        onToggle={() =>
                            map.placingPin ? map.endPlacingPin() : map.startPlacingPin()
                        }
                        text={map.placingPin ? "Placing Pin..." : "Place Pin"}
                    />
                )}
            </ControlsDiv>
        </RootDiv>
    );
});
