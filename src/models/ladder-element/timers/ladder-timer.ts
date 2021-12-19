import LadderCoordinates from "../ladder-coordinates";
import LadderElementChanges from "../ladder-element-changes";

abstract class LadderTimer {

    changes: LadderElementChanges;
    readonly hasNoActivationTime: boolean = false;
    readonly height: number = 1;
    presetTime: number = 0;
    timeBaseInMS: number = 1;

    protected _elapsedTime: number = 0;
    protected _input: boolean = false;
    protected _isActive: boolean = false;
    protected _isCounting: boolean = false;
    protected _output: boolean;

    constructor(private _isTOF: boolean) {
        // timerOff (TOF) timer starts with output equal to true and changes.output also equal to true.
        // This happens because TOF only turns output OFF (false) after the preset time is reached, and
        // the simulation must propagate, before the first evaluation, the high output of the TOF, for
        // this to happen, the element must have at least one of the changes setted to true.
        this.changes = { input: false, internalState: false, output: this._isTOF };
        this._output = this._isTOF;
    }

    get address(): string {
        return "";
    }
    
    set address(value: string) { }

    get elapsedTime(): number {
        return this._elapsedTime;
    }

    get input(): boolean {
        return this._input;
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
        this.changes = { input: false, internalState: false, output: this._isTOF };
        this._elapsedTime = 0;
        this._isActive = false;
        this._input = false;
        this._output = this._isTOF;
    }

    setInput(value: boolean, segmentCoordinates: LadderCoordinates) {
        if(this.input == value) return;
        this.changes.input = true;
        this._elapsedTime = 0;
        this._input = value;
        this._isCounting = value;
    }

}

export default LadderTimer