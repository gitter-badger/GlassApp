import { range } from "lodash";
import { observer } from "mobx-react";
import * as React from "react";
import CollapseHeading from "../components/CollapseHeading";
import ValueMeter from "../components/ValueMeter";
import { SimModel } from "../models/sim";

interface EngineMeterProps {
    sim: SimModel;
    id: number;
}

interface EngineMeterProps {
    sim: SimModel;
    id: number;
}
const EngineRPMMeter = observer((props: EngineMeterProps) => {
    const { sim, id } = props;

    const value = sim.getData(`GENERAL ENG RPM:${id}`)?.value;
    const percent = sim.getData(`GENERAL ENG PCT MAX RPM:${id}`)?.value;

    return <ValueMeter value={percent} max={100} text={value?.toFixed(2)} />;
});

export interface MixtureMetersViewProps {
    sim: SimModel;
}

export default observer((props: MixtureMetersViewProps) => {
    const { sim } = props;

    const numOfEngines = sim.getData("NUMBER OF ENGINES")?.value ?? 0;
    const engines = range(1, numOfEngines + 1);

    return (
        <CollapseHeading title="RPM">
            {engines.map(engId => (
                <EngineRPMMeter key={engId} sim={sim} id={engId} />
            ))}
        </CollapseHeading>
    );
});
