import Network from "../../network";
import LadderCoordinates from "../ladder-coordinates";
import LadderElement from "../ladder-element";

class NcInput implements LadderElement {

    changed: boolean = false;
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
        this.changed = true;
    }

    get output(): boolean {
        return this._output;
    }

    reset(): void {
        this._input = false;
        this.isActive = false;
        this._output = false;
    }

    resolve(): void {
        if(this.output == (this.input && !this.isActive)) return;
        this._output = !this.output
        this.changed = true;
    }

}

export default NcInput