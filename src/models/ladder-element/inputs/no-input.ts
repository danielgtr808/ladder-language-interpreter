import Network from "../../network";
import LadderCoordinates from "../ladder-coordinates";
import LadderElement from "../ladder-element";

class NoInput implements LadderElement {

    changed: boolean = false;
    readonly hasNoPropagationTime: boolean = false;
    isActive: boolean = false;

    private _input: boolean = false;
    private _output: boolean = false;

    constructor(public readonly coordinates: LadderCoordinates, public readonly network: Network) { }

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

    resolve(): void {
        if(this.output == (this.input && this.isActive)) return;
        this._output = !this.output
        this.changed = true;
    }

}

export default NoInput