import { range } from "lodash";
import { observer } from "mobx-react";
import * as React from "react";
import ColumnDiv from "../components/ColumnDiv";
import SimBoolIndicator from "../components/SimBoolIndicator";
import SimVarToggle from "../components/SimVarToggle";
import VerticalCollapse from "../components/VerticalCollapse";
import { SimModel } from "../models/sim";
import FuelMetersView from "./FuelMetersView";
import MixtureMetersView from "./MixtureMetersView";
import RpmMetersView from "./RpmMetersView";
import ThrottleMetersView from "./ThrottleMetersView";

export interface EngineViewProps {
    sim: SimModel;
}

export default observer((props: EngineViewProps) => {
    const { sim } = props;

    const numOfEngines = sim.getData("NUMBER OF ENGINES")?.value ?? 0;
    const engineIds = range(1, numOfEngines + 1);

    return (
        <React.Fragment>
            <VerticalCollapse title="Engine">
                <h5>Alternators</h5>
                <ColumnDiv>
                    {engineIds.map(engId => (
                        <SimVarToggle
                            sim={sim}
                            key={engId}
                            text={`${engId}`}
                            varName={`GENERAL ENG MASTER ALTERNATOR:${engId}`}
                            eventName={`TOGGLE_ALTERNATOR:${engId}`}
                        />
                    ))}
                </ColumnDiv>

                <h5>Combustion</h5>
                <ColumnDiv>
                    {engineIds.map(engId => (
                        <SimBoolIndicator
                            key={engId}
                            sim={sim}
                            text={`${engId}`}
                            varName={`GENERAL ENG COMBUSTION:${engId}`}
                        />
                    ))}
                </ColumnDiv>
                <SimVarToggle
                    sim={sim}
                    text="Pitot Heat"
                    varName="PITOT HEAT"
                    eventName="PITOT_HEAT_TOGGLE"
                />
            </VerticalCollapse>

            <RpmMetersView sim={sim} />
            <FuelMetersView sim={sim} />
            <ThrottleMetersView sim={sim} />
            <MixtureMetersView sim={sim} />
        </React.Fragment>
    );
});
