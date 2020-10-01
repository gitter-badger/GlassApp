import styled from "styled-components";
import { ACTIVE_COLOR } from "../theme";

export default styled.button<{ active?: boolean; disabled?: boolean }>`
    padding: 8px;
    border: 2px solid black;
    background-color: ${props => getBgColor(!!props.active, !!props.disabled)};
    border-radius: 4px;

    :hover {
        background-color: ${props => getHoverBgColor(!!props.active)};
    }
`;

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
