import * as React from "react";
import styled from "styled-components";
import Button from "../components/base/Button";
import { observer } from "mobx-react";
import { Link } from "react-router-dom";
import Slider from "../components/base/Slider";
import Meter from "../components/base/Meter";
import Alerter from "../components/base/Alerter";
import Toggle from "../components/base/Toggle";
import Collapse from "../components/base/Collapse";
import { useInterval } from "../utils/react";
import TextInput from "../components/base/TextInput";
import NumberInput from "../components/base/NumberInput";

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
    const [text, setText] = React.useState("");
    const [counter, setCounter] = React.useState(0);

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
                <label>Slider</label>
                <Slider
                    value={value}
                    onChange={v => {
                        setValue(v);
                    }}
                    label="Example"
                    format={v => `${(v * 100).toFixed(1)} %`}
                />
            </SandDiv>

            <SandDiv>
                <label>Meter</label>
                <Meter value={value} text={`${(value * 100).toFixed(1)} %`} hoverText="Example" />
            </SandDiv>

            <SandDiv>
                <label>Alerter</label>
                <Toggle text="Trigger Alert" active={value !== 1} onClick={() => setValue(1)} />
                <Alerter say="This is an example." text="Example" active={value >= 1} />
                <Alerter say="This is a second example." text="Example 2" active={value >= 1} />
            </SandDiv>

            <SandDiv>
                <label>TextInput</label>
                <TextInput label="Example Text Value" value={text} onChange={setText} />
            </SandDiv>

            <SandDiv>
                <label>NumberInput</label>
                <NumberInput
                    label="Example Number Value"
                    value={value}
                    onChange={v => setValue(v ?? 0)}
                    format={formatNumValue}
                />
            </SandDiv>

            <SandDiv>
                <label>CollapsibleHeading {counter}</label>
                <Collapse
                    header="Foo"
                    content={() => {
                        useInterval(() => setCounter(p => p + 1), 100);

                        return (
                            <Meter
                                value={counter % 1000}
                                max={1000}
                                text={counter}
                                hoverText="Example"
                            />
                        );
                    }}
                />
            </SandDiv>
        </RootDiv>
    );
});

function formatNumValue(v: number | undefined): string {
    if (v == null) return "N/A";
    return `${v.toFixed(2)} ft.`;
}
