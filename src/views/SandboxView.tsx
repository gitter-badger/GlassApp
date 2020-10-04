import * as React from "react";
import styled from "styled-components";
import Button from "../components/base/Button";
import { observer } from "mobx-react";
import { Link } from "react-router-dom";
import Slider from "../components/base/Slider";
import ValueMeter from "../components/base/Meter";
import Alerter from "../components/base/Alerter";
import Toggle from "../components/base/Toggle";

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
    const [value, setValue] = React.useState(0);

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

            <SandDiv>
                <Slider
                    value={value}
                    onChange={v => {
                        console.log("Slider", v);
                        setValue(v);
                    }}
                    label="Example"
                    format={v => `${(v * 100).toFixed(1)} %`}
                />
            </SandDiv>

            <SandDiv>
                <ValueMeter value={value} text={`${(value * 100).toFixed(1)} %`} title="Example" />
            </SandDiv>

            <SandDiv>
                <Toggle text="Trigger Alert" active={value !== 1} onClick={() => setValue(1)} />
                <Alerter say="This is an example." text="Example" active={value === 1} />
                <Alerter say="This is a second example." text="Example 2" active={value === 1} />
            </SandDiv>
        </RootDiv>
    );
});
