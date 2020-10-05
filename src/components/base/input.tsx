import styled, { css } from "styled-components";
import { ACTIVATABLE_COLOR, ACTIVE_COLOR, ACTIVATABLE_HOVER_COLOR } from "../../theme";

export interface BaseInputProps {
    label?: React.ReactNode;
    disabled?: boolean;
    placeholder?: string;
}

const RootActive = css`
    background-color: ${ACTIVE_COLOR};
`;

export const Root = styled.div<{ active?: boolean }>`
    background-color: ${ACTIVATABLE_COLOR};
    border: 2px solid black;
    border-radius: 16px;
    padding: 8px;
    display: flex;
    flex-direction: column;
    min-width: 100px;

    :hover {
        background-color: ${ACTIVATABLE_HOVER_COLOR};
    }

    ${p => p.active && RootActive}
`;
const InputActive = css`
    background-color: white;
`;

export const Input = styled.input<{ active?: boolean }>`
    background-color: unset;
    border: unset;

    align-self: center;
    align-self: stretch;
    font-size: 16px;
    text-align: center;

    -webkit-outer-spin-button,
    -webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    -moz-appearance: textfield;

    ${p => p.active && InputActive}
`;

export const Label = styled.label`
    align-self: center;
    margin-bottom: 4px;
    user-select: none;
`;
