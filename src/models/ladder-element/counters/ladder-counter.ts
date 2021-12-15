import LadderElement from "../ladder-element";

interface LadderCounter extends LadderElement {
    readonly currentValue: number;
    presetValue: number;

    resetTimer(): void
}

export default LadderCounter