import BitAddress from "../../memory-manager/bit-address";
import Network from "../../network";
import LadderCoordinates from "../ladder-coordinates";
import LadderElement from "../ladder-element";
import LadderTimer from "./ladder-timer";

class TOF extends LadderTimer implements LadderElement {
  
    constructor(
        private _bitAddress: BitAddress,
        public coordinates: LadderCoordinates,
        public readonly id: number,
        public readonly network: Network
    ) {
        super(true);
    }

    resolve(): void {
        if(!this.isCounting || this.isActive) return;

        this._elapsedTime += this.network.simulation.timeStepInMS;
        this.changes.internalState = true;
        
        this._isActive = (this._elapsedTime >= this.time);
        // Output is always true, unless the isActive is true, thats why, they will
        // always be different (changes.output always false), unless the elapsedTime
        // is equal to the timer time, then, the isActive will be true, equal to the
        // output, and then, the output will, indeed, change (output is the negated
        // of the isActive).
        this.changes.output = (this.output == this.isActive);
        this._output = !this._isActive;
    }  

}

export default TOF