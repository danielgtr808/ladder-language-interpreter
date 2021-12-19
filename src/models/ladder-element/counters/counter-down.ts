import LadderCoordinates from "../ladder-coordinates";
import Network from "../../network";
import LadderCounter, { _LadderCounter } from "./ladder-counter";
import BitAddress from "../../memory-manager/bit-address";

class CounterDown extends _LadderCounter implements LadderCounter {
        
    constructor(bitAddress: BitAddress, coordinates: LadderCoordinates, id: number, network: Network) {
        super(coordinates, id, network, true);
    }

    resolve(): void {
        if(this.isActive) return;
        
        this._isActive = (this.currentValue <= 0);
        this.changes.internalState = true;
        // If "isActive" and "output" are different, that means that, during this resolve,
        // the "isActive" changed, and then, the "output" will change too, because "output"
        // is a reflex of "isActive"
        this.changes.output = (this.output !== this.isActive);
        this._output = this._isActive;
    }
}

export default CounterDown