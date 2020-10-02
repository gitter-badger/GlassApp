import { observer } from "mobx-react";
import * as React from "react";
import CollapseHeading from "../components/VerticalCollapse";
import ValueMeter from "../components/ValueMeter";
import { SimModel } from "../models/sim";

interface FuelTankInfo {
    name: string;
    dataName: string;
    bit: number;
}

const FUEL_TANK_INFO: FuelTankInfo[] = [
    { name: "Center 1", bit: 0, dataName: "CENTER" },
    { name: "Center 2", bit: 1, dataName: "CENTER2" },
    { name: "Center 3", bit: 2, dataName: "CENTER3" },
    { name: "Left Main", bit: 3, dataName: "LEFT MAIN" },
    { name: "Left Aux", bit: 4, dataName: "LEFT AUX" },
    { name: "Left Tip", bit: 5, dataName: "LEFT TIP" },
    { name: "Right Main", bit: 6, dataName: "RIGHT MAIN" },
    { name: "Right Aux", bit: 7, dataName: "RIGHT AUX" },
    { name: "Right Tip", bit: 8, dataName: "RIGHT TIP" },
    { name: "External 1", bit: 9, dataName: "EXTERNAL1" },
    { name: "External 2", bit: 10, dataName: "EXTERNAL2" },
];

interface TankMeterProps {
    sim: SimModel;
    info: FuelTankInfo;
}

const FuelTankMeter = observer((props: TankMeterProps) => {
    const { sim, info } = props;

    const capacity = sim.getData(`FUEL TANK ${info.dataName} QUANTITY`)?.value ?? 0;
    if (capacity === 0) return null;

    const percent = sim.getData(`FUEL TANK ${info.dataName} LEVEL`)?.value ?? 0;
    const quantity = sim.getData(`FUEL TANK ${info.dataName} QUANTITY`)?.value ?? 0;

    return (
        <React.Fragment>
            <ValueMeter
                title={info.name}
                value={percent}
                max={100}
                text={`${quantity.toFixed(2)} GAL`}
            />
        </React.Fragment>
    );
});

interface FuelMetersViewProps {
    sim: SimModel;
}

export default observer((props: FuelMetersViewProps) => {
    const { sim } = props;

    return (
        <CollapseHeading title="Fuel">
            {FUEL_TANK_INFO.map(tankInfo => (
                <FuelTankMeter key={tankInfo.name} sim={sim} info={tankInfo} />
            ))}
        </CollapseHeading>
    );
});
