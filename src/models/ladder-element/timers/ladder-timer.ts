import LadderElement from "../ladder-element";

interface LadderTimer extends LadderElement {
    readonly elapsedTime: number;
    readonly isCounting: boolean;
    presetTime: number;
    timeBaseInMS: number;
}

export default LadderTimer