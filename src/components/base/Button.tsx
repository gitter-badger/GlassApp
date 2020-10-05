import styled, { css } from "styled-components";
import {
    ACTIVE_COLOR,
    ACTIVATABLE_HOVER_COLOR,
    DISABLED_COLOR,
    ACTIVATABLE_COLOR,
} from "../../theme";

const NORMAL_CSS = css`
    :hover {
        background-color: ${ACTIVATABLE_HOVER_COLOR};
    }
`;

const DISABLED_CSS = css`
    background-color: ${DISABLED_COLOR};
`;

const ACTIVE_CSS = css`
    box-shadow: 4px 4px 8px 2px hsla(0, 0%, 0%, 50%) inset;
    background-color: ${ACTIVE_COLOR};
`;

export default styled.button<{ active?: boolean; disabled?: boolean }>`
    padding: 8px;
    border: 2px solid black;
    border-radius: 16px;
    background-color: ${ACTIVATABLE_COLOR};

    ${p => p.active && ACTIVE_CSS}
    ${p => p.disabled && DISABLED_CSS}

    ${p => !p.disabled && NORMAL_CSS}
`;
