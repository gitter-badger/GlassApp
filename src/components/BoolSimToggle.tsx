import { observer } from "mobx-react";
import * as React from "react";
import { SimModel } from "../models/sim";
import ToggleButton from "./ToggleButton";

export interface BoolSimToggleProps {
    sdm: SimModel;
    label: string;
    dataName: string;
    eventName?: string;
}

export default observer((props: BoolSimToggleProps) => {
    const { sdm } = props;
    const def = sdm.getData(props.dataName);
    const defBool = (def?.value ?? 0) > 0.5;
    return (
        <ToggleButton
            text={props.label}
            onToggle={onToggle}
            disabled={def == null}
            toggled={defBool}
        />
    );

    function onToggle() {
        if (props.eventName != null) {
            void sdm.sendEvent(props.eventName);
            return;
        }

        void sdm.setData(props.dataName, defBool ? 0 : 1);
    }
});
