import { MapModel } from "./map";
import { SimModel } from "./sim";

export class AppModel {
    sdm = new SimModel();
    map = new MapModel();

    simInterval: number | undefined;
    failing: boolean = false;

    startListening() {
        clearInterval(this.simInterval);
        this.simInterval = setInterval(() => void this.updateTick(), 200);
    }

    async updateTick() {
        try {
            await this.update();

            if (this.failing) {
                console.log("No longer failing. Speeding up...");
                this.failing = false;

                clearInterval(this.simInterval);
                this.simInterval = setInterval(() => void this.updateTick(), 200);
            }
        } catch (e) {
            console.log("Failed to update. Slowing down...");
            clearInterval(this.simInterval);
            this.simInterval = setInterval(() => void this.updateTick(), 2000);
        }
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
