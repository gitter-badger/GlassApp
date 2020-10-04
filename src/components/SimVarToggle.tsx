import { observer } from "mobx-react";
import * as React from "react";
import { SimModel } from "../models/sim";
import ToggleButton from "./base/Toggle";

export interface SimVarToggleProps {
    sim: SimModel;
    text: string;
    varName: string;
    eventName?: string;
}

export default observer((props: SimVarToggleProps) => {
    const { sim, varName } = props;
    const def = sim.getData(varName);
    const defBool = (def?.value ?? 0) > 0.5;
    return (
        <ToggleButton
            text={props.text}
            onClick={onToggle}
            disabled={def == null}
            active={defBool}
        />
    );

    function onToggle() {
        if (props.eventName != null) {
            void sim.sendEvent(props.eventName);
            return;
        }

        void sim.setData(props.varName, defBool ? 0 : 1);
    }
});
