import BitAddress from "../../memory-manager/bit-address";
import Network from "../../network";
import LadderCoordinates from "../ladder-coordinates";
import LadderDimensions from "../ladder-dimensions";
import LadderElement from "../ladder-element";
import LadderElementChanges from "../ladder-element-changes";

interface LadderCounter extends LadderElement {
    readonly currentValue: number;
    presetValue: number;
    readonly resetSegmentCoordinates: LadderCoordinates;

    resetInput(value: boolean): void
}

export abstract class _LadderCounter {

    changes: LadderElementChanges = { input: false, internalState: false, output: false };
    readonly dimensions: LadderDimensions = { height: 2, width: 1 };
    readonly hasNoActivationTime: boolean = false;
    readonly resetSegmentCoordinates: LadderCoordinates;
    
    protected _currentValue: number = 0;
    protected _input: boolean = false;
    protected _isActive: boolean = false;
    protected _output: boolean = false;
    protected _presetValue: number = 0;

    constructor(
        public readonly coordinates: LadderCoordinates,
        public readonly id: number,
        public readonly network: Network,
        private readonly _isCTD: boolean
    ) {
        this.resetSegmentCoordinates = this.coordinates.incrementY(1);
    }

    get address(): string {
        return "";
    }
    
    set address(value: string) { }

    get currentValue(): number {
        return this._currentValue;
    }

    get input(): boolean {
        return this._input;
    }

    get isActive(): boolean {
        return this._isActive;
    }

    set isActive(value: boolean) { }

    get output(): boolean {
        return this._output;
    }

    get presetValue(): number {
        return this._presetValue;
    }

    set presetValue(value: number) {
        this._presetValue = value;
        if(this._isCTD) this._currentValue = value;
    }
    
    reset(): void {
        this.changes = { input: false, internalState: false, output: false };
        this._currentValue = this._isCTD ? this.presetValue : 0;
        this._input = false;
        this.isActive = false;
        this._output = false;
    }

    resetInput(value: boolean): void {
        if(!value) return;

        this.changes.internalState = this._isCTD ? (this.currentValue != this._presetValue) : this.currentValue > 0;
        this._currentValue = this._isCTD ? this._presetValue : 0;

        this.changes.output = this.output
        this._output = false;
    }

    setInput(value: boolean, segmentCoordinates: LadderCoordinates) {
        if(segmentCoordinates.areEqual(this.resetSegmentCoordinates)) {
            this.resetInput(value)
            return;
        }

        if(this.input == value) return;
        this._input = value;
        this.changes.input = true;

        if(!this.input || this.isActive) return;
        this._isCTD ? this._currentValue-- : this._currentValue++;
        this.changes.internalState = true;
    }

}

export default LadderCounter