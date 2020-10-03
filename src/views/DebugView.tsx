import { observer } from "mobx-react";
import * as React from "react";
import { Link } from "react-router-dom";
import CollapseHeading from "../components/VerticalCollapse";
import { SimModel } from "../models/sim";
import SimEventTriggerView from "./SimEventTriggerView";
import SimVarWatcherView from "./SimVarWatcherView";

export interface DebugViewProps {
    sim: SimModel;
}

export default observer((props: DebugViewProps) => {
    const { sim } = props;

    return (
        <CollapseHeading defaultCollapsed title="Debug">
            <SimVarWatcherView sim={sim} />
            <SimEventTriggerView sim={sim} />
            <Link to="sandbox">Go To Sandbox</Link>
        </CollapseHeading>
    );
});
