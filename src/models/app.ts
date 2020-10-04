import { autorun, observable } from "mobx";
import BlackboxModel from "./blackbox";
import { MapModel } from "./map";
import { SimModel } from "./sim";
import { Stored } from "./stored";

export class AppModel {
    @observable
    sim: SimModel;

    @observable
    map: MapModel;

    @observable
    blackbox: BlackboxModel;

    @observable
    showGreeting = new Stored({
        initial: true,
        serialize: v => (v ? "true" : "false"),
        deserialize: v => v === "true",
        key: "showGreeting",
    });

    constructor() {
        this.sim = new SimModel();
        this.map = new MapModel(this);
        this.blackbox = new BlackboxModel(this.sim);

        this.sim.connect();
    }
}
