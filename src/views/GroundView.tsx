import * as React from "react";
import { observer } from "mobx-react";
import CollapseHeading from "../components/VerticalCollapse";
import { SimModel } from "../models/sim";
import SimEventButton from "../components/SimEventButton";
import SimVarToggle from "../components/SimVarToggle";

interface GroundViewProps {
    sim: SimModel;
}

export default observer((props: GroundViewProps) => {
    const { sim } = props;

    const isOnGround = sim.getData("SIM ON GROUND")?.value === 1;
    if (!isOnGround) return null;

    return (
        <CollapseHeading title="Ground">
            <SimEventButton sim={sim} event="REQUEST_FUEL_KEY" label="Request Fuel" />
            <SimEventButton sim={sim} event="TOGGLE_PUSHBACK" label="Pushback" />
            <SimVarToggle
                sim={sim}
                text="Parking Brake"
                varName="BRAKE PARKING POSITION"
                eventName="PARKING_BRAKES"
            />
        </CollapseHeading>
    );
});
