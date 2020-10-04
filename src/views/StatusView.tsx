import { observer } from "mobx-react";
import * as React from "react";
import Alerter from "../components/base/Alerter";
import CollapseHeading from "../components/VerticalCollapse";
import { SimModel } from "../models/sim";

export interface StatusViewProps {
    sim: SimModel;
}

export default observer((props: StatusViewProps) => {
    const { sim } = props;

    const connText = sim.connected ? "Connected" : "Disconnected";

    const stalled = sim.getData("STALL WARNING")?.value === 1;
    const overspeed = sim.getData("OVERSPEED WARNING")?.value === 1;

    return (
        <CollapseHeading title="Status">
            <span>Server: {connText}</span>

            <Alerter say="Stalling" active={stalled} text="Stalled" />
            <Alerter say="Overspeed" active={overspeed} text="Overspeed" />
        </CollapseHeading>
    );
});
