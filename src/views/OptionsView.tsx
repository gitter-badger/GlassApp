import { observer } from "mobx-react";
import * as React from "react";
import CollapseHeading from "../components/VerticalCollapse";
import StringInput from "../components/StringInput";
import ToggleButton from "../components/ToggleButton";
import { SimModel } from "../models/sim";

export interface DebugViewProps {
    sim: SimModel;
}

export default observer((props: DebugViewProps) => {
    const { sim } = props;

    const simUrl = sim.serverUrl;

    return (
        <CollapseHeading defaultCollapsed title="Options">
            <ToggleButton
                text={sim.connected ? "Disconnect" : "Connect"}
                toggled={sim.connected}
                onToggle={() => (sim.connected ? sim.disconnect() : sim.connect())}
            />
            <StringInput
                label="Glass Server URL"
                placeholder="ws://localhost:8888/sim"
                value={simUrl.get()}
                onSubmit={v => v != null && simUrl.set(v)}
            />
        </CollapseHeading>
    );
});
