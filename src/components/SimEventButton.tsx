import * as React from "react";
import { SimModel } from "../models/sim";
import Button from "./base/Button";

export interface SimEventButtonProps {
    sim: SimModel;
    label: string;
    event: string;
    disabled?: boolean;
    value?: number;
}

export default React.memo((props: SimEventButtonProps) => {
    const { label, sim, event, value } = props;
    return <Button onClick={() => sim.sendEvent(event, value)}>{label}</Button>;
});
