import { MapModel } from "./MapModel";
import { SimDataModel } from "./SimDataModel";

export class AppModel {
    sdm = new SimDataModel();
    map = new MapModel();

    simInterval: number | undefined;

    startListening() {
        clearInterval(this.simInterval);
        this.simInterval = setInterval(() => void this.update(), 200);
    }

    async update() {
        await this.sdm.updateData();

        const lat = this.sdm.getData("PLANE LATITUDE")?.value;
        const long = this.sdm.getData("PLANE LONGITUDE")?.value;
        const heading = this.sdm.getData("PLANE HEADING DEGREES TRUE")?.value;

        if (lat != null && long != null) {
            this.map.updatePlanePosition(long, lat, heading ?? 0);
        }
    }
}
