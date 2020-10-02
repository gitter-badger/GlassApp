import { computed, observable } from "mobx";
import { delayMs } from "../utils/common";
import { Stored } from "./stored";

export class SimModel {
    @observable
    private sock?: WebSocket;
    private pollingInterval?: number;

    @observable
    serverUrl = new Stored<string>({
        initial: "ws://localhost:8888/sim",
        key: "glass_server_url",
        serialize: v => v,
        deserialize: v => v,
    });

    @observable
    private simDataCache = new Map<string, SimData>();
    private unknownSimDataNames = new Set<string>();

    @computed
    get connected(): boolean {
        return this.sock != null;
    }

    getData(name: string): SimData | undefined {
        return this.getCache(name);
    }

    isDataTrue(name: string): boolean {
        const def = this.getData(name);
        if (def == null) return false;

        return def.value > 0.5;
    }

    setData(name: string, value: number) {
        const data = this.simDataCache.get(name);
        if (data != null) return data;

        this.sendCommand({
            setData: { [name]: value },
        });
    }

    connect() {
        console.log("Connecting  to GlassServer socket...");
        const sock = new WebSocket(this.serverUrl.get());

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

    disconnect() {
        const sock = this.sock;
        if (sock == null) return;

        console.log("Disconnecting from Glass Server...");

        sock.close();
    }

    sendEvent(name: string, value?: number) {
        this.sendCommand({
            sendEvent: { [name]: value ?? 0 },
        });
    }

    private getCache(name: string) {
        const data = this.simDataCache.get(name);
        if (data != null) return data;

        this.unknownSimDataNames.add(name);

        return undefined;
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
