import { flatMap, range, uniq } from "lodash";
import { observer } from "mobx-react";
import * as React from "react";
import styled from "styled-components";
import BoolSimToggle from "../components/SimVarToggle";
import ColumnDiv from "../components/ColumnDiv";
import SimBoolIndicator from "../components/SimBoolIndicator";
import SimKeyValue from "../components/SimKeyValue";
import ValueMeter from "../components/ValueMeter";
import { SimModel } from "../models/sim";
import MixtureMetersView from "./MixtureMetersView";
import { filterNil } from "../utils/common";
import ThrottleMetersView from "./ThrottleMetersView";
import FuelMetersView from "./FuelMetersView";
import RpmMetersView from "./RpmMetersView";

export interface EngineViewProps {
    sim: SimModel;
}

export default observer((props: EngineViewProps) => {
    const { sim } = props;

    const numOfEngines = sim.getData("NUMBER OF ENGINES")?.value ?? 0;
    const engineIds = range(1, numOfEngines + 1);

    return (
        <React.Fragment>
            <h3>Engine</h3>
            <h5>Alternators</h5>
            <ColumnDiv>
                {engineIds.map(engId => (
                    <BoolSimToggle
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

            <RpmMetersView sim={sim} />
            <FuelMetersView sim={sim} />
            <ThrottleMetersView sim={sim} />
            <MixtureMetersView sim={sim} />
        </React.Fragment>
    );
});
