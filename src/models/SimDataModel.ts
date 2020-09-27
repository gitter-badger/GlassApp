import fetch from "isomorphic-fetch";
import { action, observable } from "mobx";

const BASE_URL = "http://localhost:5000/api/simdata/";

export interface SimData {
    name: string;
    value: number;
    units: string;
}

export class SimDataModel {
    @observable
    private simData = new Map<string, SimData>();
    private simDataNames = new Set<string>();

    @action
    async updateData(): Promise<void> {
        const apiUrl = new URL(BASE_URL);

        for (const sdName of this.simDataNames) {
            apiUrl.searchParams.append("name", sdName);
        }

        try {
            const res = await fetch(apiUrl.toString());
            const resData = (await res.json()) as SimData[];
            for (const data of resData) {
                this.simData.set(data.name, data);
            }
        } catch (e) {
            console.error(e);
        }
    }

    getData(name: string): SimData | null {
        const simData = this.simData.get(name);
        if (simData != null) return simData;

        this.simDataNames.add(name);
        return null;
    }

    isDataTrue(name: string): boolean {
        const data = this.getData(name);

        if (data == null) return false;
        return data.value === 1;
    }

    async setData(name: string, value: number): Promise<void> {
        const apiUrl = new URL(BASE_URL);

        console.log("Setting SimData", name, value);
        const res = await fetch(apiUrl.toString(), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify([{ name, value }]),
        });
    }
}
