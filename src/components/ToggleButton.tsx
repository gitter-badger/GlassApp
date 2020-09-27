import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import styled from "styled-components";

import { faCheckSquare, faSquare } from "@fortawesome/free-regular-svg-icons";
import { ACTIVE_COLOR } from "../theme";

export interface ToggleButtonProps {
    toggled?: boolean;
    disabled?: boolean;
    onToggle?(): void;
    text: React.ReactNode;
}

const RootButton = styled.button<{ active?: boolean; disabled?: boolean }>`
    & {
        padding: 8px;
        border: 2px solid black;
        background-color: ${props => getBgColor(!!props.active, !!props.disabled)};
    }

    &:hover {
        background-color: ${props => getHoverBgColor(!!props.active)};
    }
`;

export default function ToggleButton(props: ToggleButtonProps): JSX.Element {
    return (
        <RootButton
            disabled={props.disabled}
            active={props.toggled}
            onClick={() => props.onToggle?.()}
        >
            <FontAwesomeIcon icon={props.toggled ? faCheckSquare : faSquare} /> {props.text}
        </RootButton>
    );
}

function getBgColor(active: boolean, disabled: boolean) {
    if (active) {
        if (disabled) return "#00cccc";
        else return ACTIVE_COLOR;
    } else {
        if (disabled) return "#888888";
        else return "#ffffff";
    }
}

function getHoverBgColor(active: boolean) {
    if (active) return "#00dddd";
    else "#cccccc";
}
