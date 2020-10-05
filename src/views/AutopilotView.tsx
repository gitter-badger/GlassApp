import { observer } from "mobx-react";
import * as React from "react";
import NumberInput from "../components/base/NumberInput";
import SimBoolIndicator from "../components/SimBoolIndicator";
import BoolSimToggle from "../components/SimVarToggle";
import CollapseHeading from "../components/VerticalCollapse";
import { SimModel } from "../models/sim";

export interface AutopilotViewProps {
    sim: SimModel;
}

export default observer((props: AutopilotViewProps) => {
    const { sim } = props;

    const apAvailable = sim.getData("AUTOPILOT AVAILABLE")?.value === 1;
    if (!apAvailable) return null;

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
            <BoolSimToggle
                sim={sim}
                text="Airspeed Hold"
                varName="AUTOPILOT AIRSPEED HOLD"
                eventName="AP_AIRSPEED_HOLD"
            />
            <AirspeedInput sim={sim} />
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
            onChange={value => value != null && sim.sendEvent("HEADING_BUG_SET", Math.round(value))}
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
            onChange={value =>
                value != null && sim.sendEvent("AP_ALT_VAR_SET_ENGLISH", Math.round(value))
            }
        />
    );
});

const AirspeedInput = observer((props: { sim: SimModel }) => {
    const { sim } = props;

    const val = sim.getData("AUTOPILOT AIRSPEED HOLD VAR")?.value;

    return (
        <NumberInput
            label="Airspeed"
            disabled={val == null}
            value={Math.round(val ?? 0)}
            format={v => `${v} kts`}
            onChange={value => value != null && sim.sendEvent("AP_SPD_VAR_SET", Math.round(value))}
        />
    );
});

const VerticalSpeedInput = observer((props: { sim: SimModel }) => {
    const { sim } = props;

    const val = sim.getData("AUTOPILOT VERTICAL HOLD VAR")?.value;

    return (
        <NumberInput
            label="Vertical Speed"
            disabled={val == null}
            value={Math.round(val ?? 0)}
            format={v => `${v} kts`}
            onChange={value =>
                value != null && sim.sendEvent("AP_VS_VAR_SET_ENGLISH", Math.round(value))
            }
        />
    );
});
