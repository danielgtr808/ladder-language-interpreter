import Network from "../../network";
import LadderCoordinates from "../ladder-coordinates";
import LadderDimensions from "../ladder-dimensions";
import LadderElementChanges from "../ladder-element-changes";
import LadderTimer from "./ladder-timer";

class TON implements LadderTimer {

    changes: LadderElementChanges = { input: false, internalState: false, output: false };
    readonly dimensions: LadderDimensions = { height: 1, width: 1 };
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
        this.changes = { input: false, internalState: false, output: false };
        this._elapsedTime = 0;
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

export default TON