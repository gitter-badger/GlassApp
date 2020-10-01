import { faCheckSquare, faSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import Button from "./Button";

export interface ToggleButtonProps {
    toggled?: boolean;
    disabled?: boolean;
    onToggle?(): void;
    text: React.ReactNode;
}

export default function ToggleButton(props: ToggleButtonProps): JSX.Element {
    return (
        <Button disabled={props.disabled} active={props.toggled} onClick={() => props.onToggle?.()}>
            <FontAwesomeIcon icon={props.toggled ? faCheckSquare : faSquare} /> {props.text}
        </Button>
    );
}
