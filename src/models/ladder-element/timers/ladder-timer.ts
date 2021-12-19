import LadderCoordinates from "../ladder-coordinates";
import LadderElementChanges from "../ladder-element-changes";

class LadderTimer {

    changes: LadderElementChanges = { input: false, internalState: false, output: false };;
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
        // timerOff (TOF) timer starts with output equal to true. This happens because TOF only turns 
        // output OFF (false) after the preset time is reached.
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
        this.changes = { input: false, internalState: false, output: false };
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