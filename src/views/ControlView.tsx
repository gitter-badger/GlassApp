import { observer } from "mobx-react";
import * as React from "react";
import SimVarToggle from "../components/SimVarToggle";
import ValueMeter from "../components/Meter";
import CollapseHeading from "../components/VerticalCollapse";
import { SimModel } from "../models/sim";

export interface ControlViewProps {
    sim: SimModel;
}

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
            <ValueMeter
                title="Airspeed"
                max={maxAirspeed}
                value={airspeed}
                text={`${airspeed.toFixed(1)} kts`}
            />
        </CollapseHeading>
    );
});
