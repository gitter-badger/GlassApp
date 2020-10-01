import { observer } from "mobx-react";
import * as React from "react";
import styled from "styled-components";
import BoolSimToggle from "../components/SimVarToggle";
import CollapseHeading from "../components/CollapseHeading";
import ColumnDiv from "../components/ColumnDiv";
import { SimModel } from "../models/sim";

export interface LightsViewProps {
    sim: SimModel;
}

export default observer((props: LightsViewProps) => {
    const { sim } = props;
    return (
        <CollapseHeading title="Lights">
            <BoolSimToggle sim={sim} text="Taxi" varName="LIGHT TAXI" />
            <BoolSimToggle sim={sim} text="Beacon" varName="LIGHT BEACON" />

            <BoolSimToggle sim={sim} text="Navigation" varName="LIGHT NAV" />
            <BoolSimToggle sim={sim} text="Landing" varName="LIGHT LANDING" />

            <BoolSimToggle sim={sim} text="Strobe" varName="LIGHT STROBE" />
            <BoolSimToggle sim={sim} text="Logo" varName="LIGHT LOGO" />

            <BoolSimToggle sim={sim} text="Cabin" varName="LIGHT CABIN" />
            <BoolSimToggle sim={sim} text="Panel" varName="LIGHT PANEL" />
        </CollapseHeading>
    );
});
