import { observer } from "mobx-react";
import * as React from "react";
import styled from "styled-components";
import { ENABLED_COLOR } from "../theme";
import { mapRange } from "../utils/common";

export interface ValueProgressProps {
    min?: number;
    value?: number;
    max?: number;
    text?: string;
    title?: string;
}

const RootDiv = styled.div`
    position: relative;
    overflow: hidden;

    height: 32px;

    background-color: hsl(0, 0%, 80%);
    border: 1px black solid;
    border-radius: 8px;
    background-size: 64px 32px;

    &:after {
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        width: 100%;
        height: 100%;
        box-shadow: 0 5px 5px -5px #333 inset;
    }
`;

const MyMeter = styled.div`
    height: 32px;
    border-radius: 8px;
    background-color: ${ENABLED_COLOR};
    transition: width 200ms;
`;

const MyOverlay = styled.div`
    background-color: hsla(0, 0%, 100%, 75%);
    padding: 2px 4px;
    position: absolute;
    border-radius: 4px;
    white-space: nowrap;
    word-wrap: unset;
    text-overflow: ellipsis;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
`;

export default observer((props: ValueProgressProps) => {
    const { text, value, min, max, title } = props;

    const [clicking, setClicking] = React.useState(false);
    const [hovering, setHovering] = React.useState(false);
    const textShown = !(hovering || clicking) ? text : title ?? text;

    const percent = mapRange(value ?? 0, min ?? 0, max ?? 1, 0, 100);

    return (
        <RootDiv
            onPointerDown={() => setClicking(true)}
            onPointerUp={() => setClicking(false)}
            onPointerOver={() => setHovering(true)}
            onPointerOut={() => setHovering(false)}
        >
            <MyMeter style={{ width: `${percent.toFixed(3)}%` }} />
            {textShown != null && <MyOverlay>{textShown}</MyOverlay>}
        </RootDiv>
    );
});
