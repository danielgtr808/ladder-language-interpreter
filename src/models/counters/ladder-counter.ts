import LadderElement from "../ladder-element/ladder-element";

interface LadderCounter extends LadderElement {
    readonly currentValue: number;
    presetValue: number;
}

export default LadderCounter