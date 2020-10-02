import * as React from "react";
import styled from "styled-components";
import Button from "../components/Button";
import { observer } from "mobx-react";
import { Link } from "react-router-dom";

export interface SandboxView {}

const RootDiv = styled.div`
    width: 500px;
    margin: 0 auto;
`;

const SandDiv = styled.div`
    border: 1px black solid;
    margin: 8px;
    padding: 8px;
    display: flex;
    flex-direction: column;
`;

export default observer((props: SandboxView) => {
    return (
        <RootDiv>
            <Link to="/">Back to Home</Link>

            <SandDiv>
                <label>Button</label>
                <Button>Todo</Button>
            </SandDiv>
            <SandDiv>
                <label>Button (Active)</label>
                <Button active>Todo</Button>
            </SandDiv>

            <SandDiv>
                <label>Button (Disabled)</label>
                <Button disabled>Todo</Button>
            </SandDiv>
        </RootDiv>
    );
});
