import { observer } from "mobx-react";
import * as React from "react";
import { SimDataModel } from "../models/SimDataModel";
import ToggleButton from "./ToggleButton";

export default observer((props: { sdm: SimDataModel; label: string; name: string }) => {
    const { sdm } = props;
    const def = sdm.getData(props.name);
    const defBool = (def?.value ?? 0) > 0.5;
    return (
        <ToggleButton
            text={props.label}
            onToggle={() => sdm.setData(props.name, defBool ? 0 : 1)}
            disabled={def == null}
            toggled={defBool}
        />
    );
});
