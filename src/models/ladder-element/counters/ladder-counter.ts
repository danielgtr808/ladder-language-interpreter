import LadderCoordinates from "../ladder-coordinates";
import LadderElement from "../ladder-element";

interface LadderCounter extends LadderElement {
    readonly currentValue: number;
    presetValue: number;
    readonly resetSegmentCoordinates: LadderCoordinates;

    resetInput(value: boolean): void
}

export default LadderCounter