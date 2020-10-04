import { observer } from "mobx-react";
import * as React from "react";
import styled from "styled-components";
import { useInterval } from "../../utils/react";
import { manager } from "../../models/speech_manager";

export interface AlertIndicatorProps {
    text: string;
    active?: boolean;
    say?: string;
}

const MyButton = styled.button<{ active?: boolean; dimmed?: boolean }>`
    padding: 8px;
    border-radius: 8px;
    border: 2px black solid;

    ${p => p.active && p.dimmed && "background-color: rgb(127, 0, 0);"}
    ${p => p.active && !p.dimmed && "background-color: rgb(255, 0, 0);"}
    ${p => p.active && "color: white;"}
`;

export default observer((props: AlertIndicatorProps) => {
    const { text, active, say } = props;

    const [acknowledged, setAcknowledged] = React.useState(false);
    const [dimmed, setDimmed] = React.useState(false);

    const utterance = React.useMemo(() => {
        if (say == null) return null;
        return new SpeechSynthesisUtterance(`Warning; ${say}`);
    }, [say]);

    React.useEffect(() => {
        setAcknowledged(false);
    }, [active]);

    const isFlashing = !acknowledged && active;

    React.useEffect(() => {
        if (!isFlashing) return;
        if (!utterance) return;

        return manager.register(utterance);
    }, [isFlashing, utterance]);

    useInterval(() => {
        setDimmed(p => !p);
    }, isFlashing && 250);

    return (
        <MyButton
            active={active}
            dimmed={dimmed || acknowledged}
            onClick={() => setAcknowledged(true)}
            disabled={!props.active}
        >
            {text}
        </MyButton>
    );
});
