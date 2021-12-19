import BitAddress from "../../memory-manager/bit-address";
import Network from "../../network";
import LadderCoordinates from "../ladder-coordinates";
import LadderElement from "../ladder-element";
import LadderInput from "./ladder-input";

class NcInput extends LadderInput implements LadderElement {

    constructor(bitAddress: BitAddress, coordinates: LadderCoordinates, id: number, network: Network) {
        super(bitAddress, coordinates, id, network);
    }

    resolve(): void {
        if(this.output == (this.input && !this.isActive)) return;
        this._output = !this.output
        this.changes.output = true;
    }

}

export default NcInput