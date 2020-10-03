import { autorun, observable } from "mobx";
import BlackboxModel from "./blackbox";
import { MapModel } from "./map";
import { SimModel } from "./sim";

export class AppModel {
    @observable
    sim: SimModel;

    @observable
    map: MapModel;

    @observable
    blackbox: BlackboxModel;

    constructor() {
        this.sim = new SimModel();
        this.map = new MapModel(this);
        this.blackbox = new BlackboxModel(this.sim);

        this.sim.connect();

        autorun(() => {
            const isStalling = this.sim.getData("STALL WARNING")?.value === 1;

            if (isStalling) {
                console.log("Stalling!");
                const stallNoti = new Notification("You are stalling!");
            }
        });
    }
}
