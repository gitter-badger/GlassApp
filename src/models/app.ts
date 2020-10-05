import { autorun, observable } from "mobx";
import BlackboxModel from "./blackbox";
import { MapModel } from "./map";
import { SimModel } from "./sim";
import { LocallyStored } from "./locally_stored";
import { LOCAL_STORAGE_DOMAIN } from "../constants";

export class AppModel {
    @observable
    sim: SimModel;

    @observable
    map: MapModel;

    @observable
    blackbox: BlackboxModel;

    @observable
    showGreeting = new LocallyStored({
        initial: true,
        serialize: v => (v ? "true" : "false"),
        deserialize: v => v === "true",
        name: "showGreeting",
        domain: LOCAL_STORAGE_DOMAIN,
    });

    constructor() {
        this.sim = new SimModel();
        this.map = new MapModel(this);
        this.blackbox = new BlackboxModel(this.sim);

        this.sim.connect();
    }
}
