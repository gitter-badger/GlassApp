import fetch from "isomorphic-fetch";
import { action, observable } from "mobx";

const BASE_URL = "http://localhost:5000/";

export class SimModel {
    private sock?: WebSocket;
    private pollingInterval?: number;

    @observable
    private simDataCache = new Map<string, SimData>();
    private unknownSimDataNames = new Set<string>();

    getData(name: string): SimData | null {
        const simData = this.simDataCache.get(name);
        if (simData != null) return simData;

        this.unknownSimDataNames.add(name);

        return null;
    }

    isDataTrue(name: string): boolean {
        const def = this.getData(name);
        if (def == null) return false;

        return def.value > 0.5;
    }

    async setData(name: string, value: number): Promise<void> {}

    connect() {
        console.log("Connecting  to GlassServer socket...");
        const sock = new WebSocket("ws://localhost:8888/sim");

        sock.onopen = () => {
            console.log("Connected to GlassServer socket!");
            this.sock = sock;

            clearInterval(this.pollingInterval);
            this.pollingInterval = setInterval(() => this.tick(), 250);
        };

        sock.onmessage = event => {
            this.processCommand(JSON.parse(event.data as string));
        };

        sock.onclose = ev => {
            console.log(
                "Closed connection to GlassServer socket.",
                ev.reason,
                ev.code,
                ev.wasClean
            );

            if (!ev.wasClean) {
                this.connect();
            }
        };
    }

    sendEvent(name: string, value?: number) {
        this.sendCommand({
            sendEvent: { [name]: value ?? 0 },
        });
    }

    private tick() {
        this.sendCommand({ getData: true, subscribe: [...this.unknownSimDataNames] });
    }

    private processCommand(cmd: SimServerCommand) {
        //console.log("Processing: ", cmd);
        if (cmd.updateData != null && cmd.updateData.length > 0) {
            for (const def of cmd.updateData) {
                this.simDataCache.set(def.name, def);
                this.unknownSimDataNames.delete(def.name);
            }
        }
    }

    private sendCommand(cmd: SimClientCommand) {
        const sock = this.sock;
        if (sock == null) return;

        //console.log("Sending: ", cmd);
        sock.send(JSON.stringify(cmd));
    }
}

export interface SimData {
    name: string;
    units: string;
    value: number;
    text: string;
}

interface SimClientCommand {
    subscribe?: string[];
    setData?: { [key: string]: number };
    getData?: boolean;
    sendEvent?: { [key: string]: number };
}

interface SimServerCommand {
    updateData?: SimData[];
}
