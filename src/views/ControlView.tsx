import { observer } from "mobx-react";
import * as React from "react";
import SimVarToggle from "../components/SimVarToggle";
import ValueMeter from "../components/base/Meter";
import CollapseHeading from "../components/VerticalCollapse";
import { SimModel } from "../models/sim";
import SimEventButton from "../components/SimEventButton";
import styled from "styled-components";
import Button from "../components/base/Button";
import { flexSpacing } from "../utils/style";
import { minBy, range } from "lodash";
import { nil } from "../utils/common";

export interface ControlViewProps {
    sim: SimModel;
}

const ColumnDiv = styled.div`
    display: flex;
    flex-direction: row;

    ${flexSpacing(4, "row")}

    * {
        flex-grow: 1;
    }
`;

export default observer((props: ControlViewProps) => {
    const { sim } = props;

    const airspeed = sim.getData("AIRSPEED TRUE")?.value ?? 0;
    const maxAirspeed = sim.getData("AIRSPEED BARBER POLE")?.value ?? 200;

    return (
        <CollapseHeading title="Control">
            <SimVarToggle
                sim={sim}
                text="Landing Gear"
                varName="GEAR HANDLE POSITION"
                eventName="GEAR_TOGGLE"
            />
            <FlapsView sim={sim} />
            <ValueMeter
                title="Airspeed"
                max={maxAirspeed}
                value={airspeed}
                text={`${airspeed.toFixed(1)} kts`}
            />
            <h3>Reset Trims</h3>
            <ColumnDiv>
                <SimEventButton sim={sim} label="Elevator" event="AXIS_ELEV_TRIM_SET" value={0} />
                <Button onClick={() => sim.setData("AILERON TRIM PCT", 0)}>Aileron</Button>
                <Button onClick={() => sim.setData("RUDDER TRIM PCT", 0)}>Rudder</Button>
            </ColumnDiv>
        </CollapseHeading>
    );
});

interface FlapsViewProps {
    sim: SimModel;
}

const FlapsView = observer((props: FlapsViewProps) => {
    const { sim } = props;

    const flapsAvailable = sim.getData("FLAPS AVAILABLE")?.value === 1;
    if (!flapsAvailable) return null;

    const numOfFlaps = sim.getData("FLAPS NUM HANDLE POSITIONS")?.value ?? 0;
    const flapsPercent = sim.getData("FLAPS HANDLE PERCENT")?.value;
    const currentFlapIdx = getFlapsIndexFromPercent(numOfFlaps, flapsPercent);

    return (
        <React.Fragment>
            <h3>Flaps</h3>
            <ColumnDiv>
                {range(0, numOfFlaps + 1).map(flapIdx => {
                    const flapsValue = flapIdx / numOfFlaps;
                    const flapPct = Math.round(flapsValue * 100);

                    return (
                        <Button
                            onClick={() =>
                                sim.sendEvent("FLAPS_SET", Math.round(flapsValue * 16383))
                            }
                            key={flapIdx}
                            active={currentFlapIdx === flapIdx}
                        >
                            {flapPct == 0 ? "Up" : `${flapPct} %`}
                        </Button>
                    );
                })}
            </ColumnDiv>
        </React.Fragment>
    );
});

function getFlapsIndexFromPercent(numOfFlaps: number, flapsPercent: number | nil) {
    if (flapsPercent == null) return undefined;

    const currentFlapIdx = minBy(range(0, numOfFlaps + 1), idx =>
        Math.abs((idx / numOfFlaps) * 100 - flapsPercent)
    );

    return currentFlapIdx;
}
