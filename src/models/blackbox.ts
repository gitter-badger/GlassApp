import { action, observable } from "mobx";
import { interval } from "../utils/common";
import { SimModel } from "./sim";

export interface BlackboxLog {
    longitude: number;
    latitude: number;
    altitude: number;
    heading: number;
    date: Date;
}

export default class BlackboxModel {
    @observable
    logs: BlackboxLog[] = [];

    @observable
    logging: boolean = false;

    private sim: SimModel;
    private intervalDisposer?: () => void;

    constructor(sim: SimModel) {
        this.sim = sim;
    }

    @action.bound
    startLogging(): void {
        this.intervalDisposer?.();
        this.intervalDisposer = undefined;

        this.addLog();
        this.intervalDisposer = interval(() => {
            this.addLog();
        }, 10000);

        this.logging = true;
    }

    @action.bound
    stopLogging(): void {
        this.intervalDisposer?.();
        this.intervalDisposer = undefined;
        this.logging = false;
    }

    @action.bound
    addLog(): void {
        const altitude = this.sim.getData("PLANE ALTITUDE")?.value;
        if (altitude == null) return;

        const latitude = this.sim.getData("PLANE LATITUDE")?.value;
        if (latitude == null) return;

        const longitude = this.sim.getData("PLANE LONGITUDE")?.value;
        if (longitude == null) return;

        const heading = this.sim.getData("PLANE HEADING DEGREES TRUE")?.value;
        if (heading == null) return;

        this.logs.push({
            altitude,
            latitude,
            longitude,
            heading,
            date: new Date(),
        });
    }

    @action.bound
    clearLog(): void {
        this.logs = [];
    }

    downloadLog(): void {
        const dataLog = JSON.stringify(this.logs);

        const element = document.createElement("a");
        element.setAttribute(
            "href",
            "data:application/json;charset=utf-8," + encodeURIComponent(dataLog)
        );
        element.setAttribute("download", "flightlog");

        element.style.display = "none";
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }
}
