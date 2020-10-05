import { range } from "lodash";
import { observer } from "mobx-react";
import * as React from "react";
import Collapse from "../components/base/Collapse";
import ValueMeter from "../components/base/Meter";
import { SimModel } from "../models/sim";

interface EngineMeterProps {
    sim: SimModel;
    id: number;
}

const EngineThrottleMeter = observer((props: EngineMeterProps) => {
    const { sim, id } = props;

    const percent = sim.getData(`GENERAL ENG THROTTLE LEVER POSITION:${id}`)?.value ?? 0;

    return (
        <ValueMeter
            hoverText={`Engine ${id}`}
            value={percent}
            max={100}
            text={`${percent.toFixed(2)}%`}
        />
    );
});

interface InnerProps {
    sim: SimModel;
}

const Inner = observer((props: InnerProps) => {
    const { sim } = props;
    const numOfEngines = sim.getData("NUMBER OF ENGINES")?.value ?? 0;
    const engines = range(1, numOfEngines + 1);

    return (
        <React.Fragment>
            {engines.map(engId => (
                <EngineThrottleMeter key={engId} sim={sim} id={engId} />
            ))}
        </React.Fragment>
    );
});

export interface ThrottleMetersView {
    sim: SimModel;
}

export default observer((props: ThrottleMetersView) => {
    const { sim } = props;

    return <Collapse props={{ sim }} header="Throttle" content={Inner} />;
});
