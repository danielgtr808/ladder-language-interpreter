import Network from "../../network";
import LadderCoordinates from "../ladder-coordinates";
import LadderElementChanges from "../ladder-element-changes";
import LadderTimer from "./ladder-timer";

class TOF implements LadderTimer {

    // "output" starts changed, because, the propagation of the output is only for changed
    // output. The TOF starts with "output" setted to true, but, if it's not marked as
    // changed, then, it will not propagate.
    changes: LadderElementChanges = { input: false, internalState: false, output: true };
    readonly hasNoActivationTime: boolean = false;

    private _elapsedTime: number = 0;
    private _input: boolean = false;
    private _isActive: boolean = false;
    private _isCounting: boolean = false;
    private _output: boolean = true;
    private _presetTime: number = 0;
    private _timeBaseInMS: number = 1;
  
    constructor(
        public coordinates: LadderCoordinates,
        public readonly id: number,
        public readonly network: Network
    ) { }

    get elapsedTime(): number {
        return this._elapsedTime;
    }

    get input(): boolean {
        return this._input;
    }

    set input(value: boolean) {
        if(this.input == value) return;
        this.changes.input = true;
        this._elapsedTime = 0;
        this._input = value;
        this._isCounting = value;
    }

    get isActive(): boolean {
        return this._isActive;
    }

    set isActive(value: boolean) { }

    get isCounting(): boolean {
        return this._isCounting;
    }

    get output(): boolean {
        return this._output;
    }

    get presetTime(): number {
        return this._presetTime;
    }

    set presetTime(value: number) {
        this._presetTime = value;
        this._elapsedTime = this.time;
    }

    get time(): number {
        return this.presetTime*this.timeBaseInMS;
    }

    get timeBaseInMS(): number {
        return this._timeBaseInMS;
    }

    set timeBaseInMS(value: number) {
        this._timeBaseInMS = value;
        this._elapsedTime = this.time;
    }

    reset(): void {
        this.changes = { input: false, internalState: false, output: true };
        this._elapsedTime = this.time;
        this._isActive = false;
        this._input = false;
        this._output = false;
    }

    resolve(): void {
        if(!this.isCounting || this.isActive) return;

        this._elapsedTime += this.network.simulation.timeStepInMS;
        this.changes.internalState = true;
        
        this._isActive = (this._elapsedTime >= this.time);
        // If "isActive" and "output" are different, that means that, during this resolve,
        // the "isActive" changed, and then, the "output" will change too, because "output"
        // is a reflex of "isActive"
        this.changes.output = (this.output !== this.isActive);
        this._output = this._isActive;
    }

}

export default TOF