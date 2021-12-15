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
    presetTime: number = 0;
    timeBaseInMS: number = 1;

    private _elapsedTime: number = 0;
    private _input: boolean = false;
    private _output: boolean = false;
    private _isActive: boolean = false;
    private _isCounting: boolean = false;
  
  
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

    get time(): number {
        return this.presetTime*this.timeBaseInMS;
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
        // Output is always true, unless the isActive is true, thats why, they will
        // always be different (changes.output always false), unless the elapsedTime
        // is equal to the timer time, then, the isActive will be true, equal to the
        // output, and then, the output will, indeed, change (output is the negated
        // of the isActive).
        this.changes.output = (this.output == this.isActive);
        this._output = !this._isActive;
    }

}

export default TOF