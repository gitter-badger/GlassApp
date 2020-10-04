import { autorun, observable } from "mobx";
import { Disposer, interval } from "../utils/common";
import { Stored } from "./stored";

export class SimModel {
    @observable
    private sock?: WebSocket;

    @observable
    connected: boolean = false;

    private retryConnectionDisposer?: Disposer;
    private pollingIntervalDisposer?: Disposer;

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

    constructor() {
        this.connect();

        autorun(() => {
            if (this.sock != null) return;

            this.connect();
        });
    }

    getData(name: string): SimData | undefined {
        return this.getCache(name);
    }

    setData(name: string, value: number) {
        const data = this.simDataCache.get(name);
        if (data != null) return data;

        this.sendCommand({
            setData: { [name]: value },
        });
    }

    connect(): void {
        // Already processing socket
        if (this.sock != null) return;

        console.log("Connecting  to GlassServer socket...");
        this.connected = false;
        const sock = new WebSocket(this.serverUrl.get());
        this.sock = sock;

        setTimeout(() => {
            if (sock.readyState == sock.OPEN) return;
            sock.close();
        }, 2000);

        sock.addEventListener("open", () => {
            console.log("Connected to GlassServer socket!");
            this.connected = true;

            this.pollingIntervalDisposer?.();
            this.pollingIntervalDisposer = interval(() => this.tick(), 250);
        });

        sock.addEventListener("message", event => {
            this.processCommand(JSON.parse(event.data as string));
        });

        sock.addEventListener("close", ev => {
            console.log(
                "Closed connection to GlassServer socket.",
                ev.reason,
                ev.code,
                ev.wasClean
            );

            this.sock = undefined;
            this.connected = false;
        });
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
        if (!this.connected) return;

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
