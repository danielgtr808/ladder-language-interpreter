import Network from "../../network";
import LadderCoordinates from "../ladder-coordinates";
import LadderDimensions from "../ladder-dimensions";
import LadderElement from "../ladder-element";
import LadderElementChanges from "../ladder-element-changes";

class NoInput implements LadderElement {

    changes: LadderElementChanges = { input: false, internalState: false, output: false };
    readonly dimensions: LadderDimensions = { height: 1, width: 1 };
    readonly hasNoActivationTime: boolean = false;
    isActive: boolean = false;

    private _input: boolean = false;
    private _output: boolean = false;

    constructor(public readonly coordinates: LadderCoordinates, public readonly id: number, public readonly network: Network) { }

    get input(): boolean {
        return this._input;
    }

    get output(): boolean {
        return this._output;
    }

    reset(): void {
        this.changes = { input: false, internalState: false, output: false };
        this._input = false;
        this.isActive = false;
        this._output = false;
    }

    resolve(): void {
        if(this.output == (this.input && this.isActive)) return;
        this._output = !this.output
        this.changes.output = true;
    }

    setInput(value: boolean, segmentCoordinates: LadderCoordinates): void {
        if(this.input == value) return;
        this._input = value;
        this.changes.input = true;
    }

}

export default NoInput