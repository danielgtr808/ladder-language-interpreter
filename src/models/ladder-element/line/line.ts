import BitAddress from "../../memory-manager/bit-address";
import Network from "../../network";
import LadderCoordinates from "../ladder-coordinates";
import LadderElement from "../ladder-element";
import LadderElementChanges from "../ladder-element-changes";

class Line implements LadderElement {

    changes: LadderElementChanges = { input: false, internalState: false, output: false };
    readonly hasNoActivationTime: boolean = true;
    readonly height: number = 1;
    isActive: boolean = false;

    private _input: boolean = false;
    private _output: boolean = false;

    constructor(
        private _bitAddress: BitAddress,
        public readonly coordinates: LadderCoordinates,
        public readonly id: number,
        public readonly network: Network
    ) { }

    get address(): string { 
        return "";
    }
    
    set address(value: string) {}


    get input(): boolean {
        return this._input;
    }

    get output(): boolean {
        return this._output;
    }

    reset(): void {
        this._input = false;
        this.isActive = false;
        this._output = false;
        this.changes = { input: false, internalState: false, output: false };
    }

    resolve(): void {
        if(this.input == this.output) return;
        this._output = this.input
        this.changes.output = true;
    }

    setInput(value: boolean, segmentCoordinates: LadderCoordinates): void {
        if(this.input == value) return;
        this._input = value;
        this.changes.input = true;
    }

}

export default Line