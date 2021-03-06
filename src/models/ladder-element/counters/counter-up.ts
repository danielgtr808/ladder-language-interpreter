import LadderCoordinates from "../ladder-coordinates";
import Network from "../../network";
import LadderCounter from "./ladder-counter";
import BitAddress from "../../memory-manager/bit-address";
import LadderElement from "../ladder-element";

class CounterUp extends LadderCounter implements LadderElement {
    
    constructor(bitAddress: BitAddress, coordinates: LadderCoordinates, id: number, network: Network) {
        super(coordinates, id, network, false);
    }

    resolve(): void {
        if(this.isActive) return;
        
        this._isActive = (this.currentValue >= this.presetValue);
        this.changes.internalState = true;
        // If "isActive" and "output" are different, that means that, during this resolve,
        // the "isActive" changed, and then, the "output" will change too, because "output"
        // is a reflex of "isActive"
        this.changes.output = (this.output !== this.isActive);
        this._output = this._isActive;
    }
}

export default CounterUp