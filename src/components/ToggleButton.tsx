import { faCheckSquare, faSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import Button from "./Button";

export interface ToggleButtonProps {
    active?: boolean;
    disabled?: boolean;
    onClick?(): void;
    text: React.ReactNode;
    children?: React.ReactNode | React.ReactNode[];
}

export default function ToggleButton(props: ToggleButtonProps): JSX.Element {
    return (
        <Button disabled={props.disabled} active={props.active} onClick={() => props.onClick?.()}>
            <FontAwesomeIcon icon={props.active ? faCheckSquare : faSquare} />{" "}
            {props.text ?? props.children}
        </Button>
    );
}
