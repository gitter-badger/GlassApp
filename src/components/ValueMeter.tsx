import { observer } from "mobx-react";
import * as React from "react";
import styled from "styled-components";

export interface ValueProgressProps {
    min?: number;
    value?: number;
    max?: number;
    text?: string;
    title?: string;
    high?: number;
}

const RootDiv = styled.div`
    position: relative;
    overflow: hidden;
    border-radius: 4px;
`;

const MyMeter = styled.meter`
    width: 100%;
    min-width: 150px;
    height: 3em;
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
    const { text, value, min, max, title, high } = props;

    const [clicking, setClicking] = React.useState(false);
    const [hovering, setHovering] = React.useState(false);
    const textShown = !(hovering || clicking) ? text : title ?? text;

    return (
        <RootDiv
            onPointerDown={() => setClicking(true)}
            onPointerUp={() => setClicking(false)}
            onPointerOver={() => setHovering(true)}
            onPointerOut={() => setHovering(false)}
        >
            <MyMeter title={title} high={high} value={value} min={min} max={max} />
            {textShown != null && <MyOverlay>{textShown}</MyOverlay>}
        </RootDiv>
    );
});
