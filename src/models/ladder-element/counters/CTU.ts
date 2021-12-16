import LadderCoordinates from "../ladder-coordinates";
import LadderElementChanges from "../ladder-element-changes";
import Network from "../../network";
import LadderCounter from "./ladder-counter";
import LadderDimensions from "../ladder-dimensions";

class CTU implements LadderCounter {
    
    changes: LadderElementChanges = { input: false, internalState: false, output: false };
    readonly dimensions: LadderDimensions = { height: 2, width: 1 };
    readonly hasNoActivationTime: boolean = false;
    presetValue: number = 0;
    readonly resetSegmentCoordinates: LadderCoordinates;

    private _currentValue: number = 0;
    private _input: boolean = false;
    private _isActive: boolean = false;
    private _output: boolean = false;

    constructor(public readonly coordinates: LadderCoordinates, public readonly id: number, public readonly network: Network) {
        this.resetSegmentCoordinates = this.coordinates.incrementY(1);
    }

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

    reset(): void {
        this.changes = { input: false, internalState: false, output: false };
        this._currentValue = 0;
        this._input = false;
        this.isActive = false;
        this._output = false;
    }

    resetInput(value: boolean): void {
        if(!value) return;

        this.changes.internalState = this.currentValue > 0
        this._currentValue = 0;

        this.changes.output = this.output
        this._output = false;
    }

    resolve(): void {
        if(this.isActive) return;
        
        this._isActive = (this.currentValue >= this.presetValue);
        this.changes.internalState = true;
        // If "isActive" and "output" are different, that means that, during this resolve,
        // the "isActive" changed, and then, the "output" will change too, because "output"
        // is a reflex of "isActive"
        this.changes.output = (this.output !== this.isActive);
        this._output = this._isActive;
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
        this._currentValue++;
        this.changes.internalState = true;
    }
}

export default CTU