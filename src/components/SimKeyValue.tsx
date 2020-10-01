import { observer } from "mobx-react";
import * as React from "react";
import styled from "styled-components";
import { SimModel } from "../models/sim";

export interface SimKeyValueProps {
    sim: SimModel;
    text: string;
    dataName: string;
}

export default observer((props: SimKeyValueProps) => {
    const { sim, dataName } = props;
    const def = sim.getData(dataName);
    return (
        <React.Fragment>
            <div>
                <strong>{props.text}</strong>: {def?.text ?? def?.value.toFixed(2) ?? "N/A"}
            </div>
        </React.Fragment>
    );
});
