import { observer } from "mobx-react";
import * as React from "react";
import CollapseHeading from "../components/VerticalCollapse";
import StringInput from "../components/StringInput";
import ToggleButton from "../components/ToggleButton";
import { SimModel } from "../models/sim";
import Button from "../components/Button";

export interface DebugViewProps {
    sim: SimModel;
}

export default observer((props: DebugViewProps) => {
    const { sim } = props;

    const simUrl = sim.serverUrl;
    const grantedNotis = Notification.permission === "granted";

    return (
        <CollapseHeading defaultCollapsed title="Options">
            <Button disabled={grantedNotis} onClick={() => void Notification.requestPermission()}>
                {grantedNotis ? "Granted Notifications" : "Notification Access"}
            </Button>
            <ToggleButton
                text={sim.connected ? "Disconnect" : "Connect"}
                active={sim.connected}
                onClick={() => (sim.connected ? sim.disconnect() : sim.connect())}
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
