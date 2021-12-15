import Network from "../../network";
import LadderCoordinates from "../ladder-coordinates";
import LadderElement from "../ladder-element";
import LadderElementChanges from "../ladder-element-changes";

class NcInput implements LadderElement {

    changes: LadderElementChanges = { input: false, internalState: false, output: false };
    readonly hasNoActivationTime: boolean = false;
    isActive: boolean = false;

    private _input: boolean = false;
    private _output: boolean = false;

    constructor(public readonly coordinates: LadderCoordinates, public readonly id: number, public readonly network: Network) { }

    get input(): boolean {
        return this._input;
    }

    set input(value: boolean) {
        if(this.input == value) return;
        this._input = value;
        this.changes.input = true;
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
        if(this.output == (this.input && !this.isActive)) return;
        this._output = !this.output
        this.changes.output = true;
    }

}

export default NcInput