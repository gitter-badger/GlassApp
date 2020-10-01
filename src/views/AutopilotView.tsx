import { observer } from "mobx-react";
import * as React from "react";
import styled from "styled-components";
import BoolSimToggle from "../components/SimVarToggle";
import CollapseHeading from "../components/CollapseHeading";
import ColumnDiv from "../components/ColumnDiv";
import { SimModel } from "../models/sim";
import NumberInput from "../components/NumberInput";

export interface LightsViewProps {
    sim: SimModel;
}

export default observer((props: LightsViewProps) => {
    const { sim } = props;

    if (!sim.isDataTrue("AUTOPILOT AVAILABLE")) return null;

    return (
        <CollapseHeading title="Autopilot">
            <BoolSimToggle
                sim={sim}
                text="Autopilot"
                varName="AUTOPILOT MASTER"
                eventName="AP_MASTER"
            />
            <BoolSimToggle
                sim={sim}
                text="Flight Director"
                varName="AUTOPILOT FLIGHT DIRECTOR ACTIVE"
                eventName="TOGGLE_FLIGHT_DIRECTOR"
            />
            <BoolSimToggle
                sim={sim}
                text="Nav Lock"
                varName="AUTOPILOT NAV1 LOCK"
                eventName="AP_NAV1_HOLD"
            />
            <BoolSimToggle
                sim={sim}
                text="Heading Lock"
                varName="AUTOPILOT HEADING LOCK"
                eventName="AP_HDG_HOLD"
            />
            <HeadingDirInput sim={sim} />
            <BoolSimToggle
                sim={sim}
                text="Altitude Lock"
                varName="AUTOPILOT ALTITUDE LOCK"
                eventName="AP_PANEL_ALTITUDE_HOLD"
            />
            <AltitudeInput sim={sim} />
            <BoolSimToggle
                sim={sim}
                text="Attitude Hold"
                varName="AUTOPILOT ATTITUDE HOLD"
                eventName="AP_ATT_HOLD"
            />
            <BoolSimToggle // TODO: There is no event to enable Vertical Speed mode
                sim={sim}
                text="Vertical Speed"
                varName="AUTOPILOT VERTICAL HOLD"
            />
            <VerticalSpeedInput sim={sim} />
        </CollapseHeading>
    );
});

const HeadingDirInput = observer((props: { sim: SimModel }) => {
    const { sim } = props;

    const dir = sim.getData("AUTOPILOT HEADING LOCK DIR")?.value;

    return (
        <NumberInput
            label="Heading"
            disabled={dir == null}
            value={Math.round(dir ?? 0)}
            format={v => `${v}°`}
            onSubmit={value => value != null && sim.sendEvent("HEADING_BUG_SET", Math.round(value))}
        />
    );
});

const AltitudeInput = observer((props: { sim: SimModel }) => {
    const { sim } = props;

    const dir = sim.getData("AUTOPILOT ALTITUDE LOCK VAR")?.value;

    return (
        <NumberInput
            label="Altitude"
            disabled={dir == null}
            value={Math.round(dir ?? 0)}
            format={v => `${v} ft.`}
            onSubmit={value =>
                value != null && sim.sendEvent("AP_ALT_VAR_SET_ENGLISH", Math.round(value))
            }
        />
    );
});

const VerticalSpeedInput = observer((props: { sim: SimModel }) => {
    const { sim } = props;

    const dir = sim.getData("AUTOPILOT VERTICAL HOLD VAR")?.value;

    return (
        <NumberInput
            label="Vertical Speed"
            disabled={dir == null}
            value={Math.round(dir ?? 0)}
            format={v => `${v} ft/sec`}
            onSubmit={value =>
                value != null && sim.sendEvent("AP_VS_VAR_SET_ENGLISH", Math.round(value))
            }
        />
    );
});
