import Network from "../../network";
import LadderCoordinates from "../ladder-coordinates";
import LadderElement from "../ladder-element";

class Line implements LadderElement {

    changed: boolean = false;
    readonly hasNoPropagationTime: boolean = true;
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

    resolve(): void {
        if(this.input == this.output) return;
        this._output = this.input
        this.changed = true;
    }

}

export default Line