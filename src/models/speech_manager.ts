import { action, autorun, observable } from "mobx";
import { arrDelete } from "../utils/common";
import { speakUtterance } from "../utils/speech";
import { Stored } from "./stored";

export class SpeechManager {
    @observable
    private _utterances: SpeechSynthesisUtterance[] = [];
    private _speaking: boolean = false;

    @observable
    enabled = new Stored({
        initial: true,
        deserialize: v => v === "true",
        serialize: v => (v ? "true" : "false"),
        key: "useAlertVoices",
    });

    constructor() {
        autorun(() => void this.keepSpeaking());
    }

    @action
    register(utterance: SpeechSynthesisUtterance): () => void {
        this._utterances.push(utterance);
        return () => arrDelete(this._utterances, utterance);
    }

    private async keepSpeaking() {
        // Not enabled
        if (!this.enabled.get()) return;

        // Nothing to say
        if (this._utterances.length == 0) return;

        // Already speaking
        if (this._speaking) return;

        this._speaking = true;
        const spoken = new Set<SpeechSynthesisUtterance>();

        const getNextUnspoken = () => this._utterances.find(utt => !spoken.has(utt));

        while (this._utterances.length > 0) {
            spoken.clear();

            let nextUnspoken = getNextUnspoken();
            while (nextUnspoken != null) {
                spoken.add(nextUnspoken);

                await speakUtterance(nextUnspoken);

                nextUnspoken = getNextUnspoken();
            }
        }
        this._speaking = false;
    }
}

export const manager = new SpeechManager();
