import { observer } from "mobx-react";
import * as React from "react";
import styled from "styled-components";
import BoolSimToggle from "../components/SimVarToggle";
import CollapseHeading from "../components/VerticalCollapse";
import ColumnDiv from "../components/ColumnDiv";
import { SimModel } from "../models/sim";

export interface LightsViewProps {
    sim: SimModel;
}

export default observer((props: LightsViewProps) => {
    const { sim } = props;
    return (
        <CollapseHeading title="Lights">
            <BoolSimToggle
                sim={sim}
                text="Taxi"
                varName="LIGHT TAXI"
                eventName="TOGGLE_TAXI_LIGHTS"
            />
            <BoolSimToggle
                sim={sim}
                text="Beacon"
                varName="LIGHT BEACON"
                eventName="TOGGLE_BEACON_LIGHTS"
            />

            <BoolSimToggle
                sim={sim}
                text="Navigation"
                varName="LIGHT NAV"
                eventName="TOGGLE_NAV_LIGHTS"
            />
            <BoolSimToggle
                sim={sim}
                text="Landing"
                varName="LIGHT LANDING"
                eventName="LANDING_LIGHTS_TOGGLE"
            />

            <BoolSimToggle
                sim={sim}
                text="Strobe"
                varName="LIGHT STROBE"
                eventName="STROBES_TOGGLE"
            />
            <BoolSimToggle
                sim={sim}
                text="Logo"
                varName="LIGHT LOGO"
                eventName="TOGGLE_LOGO_LIGHTS"
            />

            <BoolSimToggle sim={sim} text="Cabin" varName="LIGHT CABIN" />
            <BoolSimToggle
                sim={sim}
                text="Panel"
                varName="LIGHT PANEL"
                eventName="PANEL_LIGHTS_TOGGLE"
            />
        </CollapseHeading>
    );
});
