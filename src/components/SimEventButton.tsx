import * as React from "react";
import { SimModel } from "../models/sim";
import Button from "./Button";

export interface SimEventButtonProps {
    sim: SimModel;
    label: string;
    event: string;
    disabled?: boolean;
}

export default React.memo((props: SimEventButtonProps) => {
    const { label, sim, event } = props;
    return <Button onClick={() => sim.sendEvent(event)}>{label}</Button>;
});
