import { autorun, observable } from "mobx";
import { LOCAL_STORAGE_DOMAIN } from "../constants";
import { Disposer, interval } from "../utils/common";
import { LocallyStored } from "./locally_stored";

export class SimModel {
    @observable
    private sock?: WebSocket;

    @observable
    connected: boolean = false;

    private pollingIntervalDisposer?: Disposer;

    @observable
    serverUrl = new LocallyStored<string>({
        initial: "ws://localhost:8888/sim",
        domain: LOCAL_STORAGE_DOMAIN,
        name: "glassServerUrl",
        serialize: v => v,
        deserialize: v => v,
    });

    @observable
    private simDataCache = new Map<string, SimData>();
    private unknownSimDataNames = new Set<string>();

    constructor() {
        this.connect();

        // Retry to connect whenever the socket changes.
        autorun(() => {
            if (this.sock != null) return;
            this.connect();
        });
    }

    getData(name: string): SimData | undefined {
        return this.getCache(name);
    }

    setData(name: string, value: number): void {
        const data = this.simDataCache.get(name);
        if (data == null) return;

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

        // If not open in 2 seconds, something might have gone wrong.
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

    sendEvent(name: string, value?: number): void {
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
        if (cmd.updateData != null && cmd.updateData.length > 0) {
            for (const def of cmd.updateData) {
                const existingDef = this.simDataCache.get(def.name);
                if (
                    existingDef &&
                    (existingDef.value !== def.value || existingDef.text !== def.text)
                ) {
                    // Existing def exists and was changed
                    existingDef.value = def.value;
                    existingDef.text = def.text;
                } else {
                    // New def
                    this.simDataCache.set(def.name, def);
                    this.unknownSimDataNames.delete(def.name);
                }
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
