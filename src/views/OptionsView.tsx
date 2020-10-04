import { observer } from "mobx-react";
import * as React from "react";
import CollapseHeading from "../components/VerticalCollapse";
import TextInput from "../components/base/TextInput";
import { SimModel } from "../models/sim";
import Button from "../components/base/Button";
import Toggle from "../components/base/Toggle";
import { manager } from "../models/speech_manager";

export interface DebugViewProps {
    sim: SimModel;
}

export default observer((props: DebugViewProps) => {
    const { sim } = props;

    const simUrl = sim.serverUrl;
    const grantedNotis = Notification.permission === "granted";

    const voicesEnabled = manager.enabled.get();

    return (
        <CollapseHeading defaultCollapsed title="Options">
            <Button disabled={grantedNotis} onClick={() => void Notification.requestPermission()}>
                {grantedNotis ? "Granted Notifications" : "Notification Access"}
            </Button>
            <Toggle
                text="Enable Alert Voices"
                onClick={() => manager.enabled.set(!voicesEnabled)}
                active={voicesEnabled}
            ></Toggle>
            <TextInput
                label="Glass Server URL"
                placeholder="ws://localhost:8888/sim"
                value={simUrl.get()}
                onSubmit={v => v != null && simUrl.set(v)}
            />
        </CollapseHeading>
    );
});
