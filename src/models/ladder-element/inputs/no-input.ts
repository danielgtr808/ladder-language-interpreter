import Network from "../../network";
import LadderCoordinates from "../ladder-coordinates";
import LadderElement from "../ladder-element";

class NoInput implements LadderElement {

    input: boolean = false;
    isActive: boolean = false;

    private _output: boolean = false;

    constructor(public readonly coordinates: LadderCoordinates, public readonly network: Network) { }


    get output(): boolean {
        return this._output;
    }

}

export default NoInput