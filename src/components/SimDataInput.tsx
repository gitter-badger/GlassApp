import { faEdit, faLink, faUndo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react";
import * as React from "react";
import styled from "styled-components";
import { SimDataModel } from "../models/SimDataModel";
import { ACTIVE_COLOR } from "../theme";

const RootDiv = styled.div`
    padding: 4px;
    border: 2px solid black;
`;

const Button = styled.button`
    background-color: ${ACTIVE_COLOR};
    border: 2px solid black;
`;

export default observer((props: { sdm: SimDataModel; label: string; name: string }) => {
    const { sdm } = props;
    const def = sdm.getData(props.name);

    const [tracking, setTracking] = React.useState(true);
    const [input, setInput] = React.useState(0);
    const [raw, setRaw] = React.useState(0);

    React.useEffect(() => {
        if (tracking) {
            setRaw(def?.value ?? 0);
            setInput(def?.value ?? 0);
        }
    }, [def?.value]);

    React.useEffect(() => {
        if (!tracking) {
            setRaw(input);
        }
    }, [input]);

    return (
        <RootDiv>
            <label>{props.label}</label>
            <br />
            <Button disabled={tracking} onClick={() => setTracking(true)}>
                <FontAwesomeIcon icon={tracking ? faLink : faUndo} />
            </Button>
            <input type="number" value={raw.toFixed(2)} onChange={onChangeInput} />

            <Button disabled={tracking} onClick={onSubmit}>
                Go
            </Button>
        </RootDiv>
    );

    function onChangeInput(event: React.ChangeEvent<HTMLInputElement>) {
        const num = event.target.valueAsNumber;
        if (Number.isNaN(num)) return;

        if (tracking) {
            setTracking(false);
        }

        setInput(num);
    }

    function onSubmit() {
        void sdm.setData(props.name, input);
        setTracking(true);
    }
});
