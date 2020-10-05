/**
 * Speaks an utterance and resolves when finished.
 */
export async function speakUtterance(utterance: SpeechSynthesisUtterance): Promise<void> {
    return new Promise<void>(resolve => {
        const myResolve = () => {
            utterance.removeEventListener("end", myResolve);
            resolve();
        };

        utterance.addEventListener("end", myResolve);

        speechSynthesis.speak(utterance);
    });
}
