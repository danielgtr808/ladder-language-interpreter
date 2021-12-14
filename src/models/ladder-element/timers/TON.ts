import Network from "../../network";
import LadderCoordinates from "../ladder-coordinates";
import LadderTimer from "./ladder-timer";

class TON implements LadderTimer {

    changed: boolean = false;
    readonly hasNoActivationTime: boolean = false;
    presetTime: number = 0;
    timeBaseInMS: number = 1;

    private _elapsedTime: number = 0;
    private _input: boolean = false;
    private _isActive: boolean = false;
    private _isCounting: boolean = false;
  
    constructor(
        public coordinates: LadderCoordinates,
        public readonly id: number,
        public readonly network: Network
    ) { }

    reset(): void {
        throw new Error("Method not implemented.");
    }
    resolve(): void {
        throw new Error("Method not implemented.");
    }

    get elapsedTime(): number {
        return this._elapsedTime;
    }

    get input(): boolean {
        return this._input;
    }

    set input(value: boolean) {
        if(this.input == value) return;
        this.changed = true;
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
        return false;
    }

    get time(): number {
        return this.presetTime*this.timeBaseInMS;
    }

    evaluate(): void {        
        if(!this.isCounting || this.isActive) return;
        this._elapsedTime += this.network.simulation.timeStepInMS;
        this.changed = true;
        this._isActive = (this._elapsedTime >= this.time);
    }
    
}

export default TON