import { MapModel } from "./map";
import { SimModel } from "./sim";

export class AppModel {
    sim: SimModel;
    map: MapModel;

    simInterval: number | undefined;
    failing: boolean = false;

    constructor() {
        this.sim = new SimModel();
        this.map = new MapModel(this.sim);
    }

    startListening() {
        this.sim.connect();
    }
}
