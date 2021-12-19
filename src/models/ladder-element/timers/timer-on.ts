import BitAddress from "../../memory-manager/bit-address";
import Network from "../../network";
import LadderCoordinates from "../ladder-coordinates";
import LadderElement from "../ladder-element";
import LadderTimer from "./ladder-timer";

class timerOn extends LadderTimer implements LadderElement {
  
    constructor(
        private _bitAddress: BitAddress,
        public coordinates: LadderCoordinates,
        public readonly id: number,
        public readonly network: Network
    ) {
        super(false);
    }

    resolve(): void {
        if(!this.isCounting || this.isActive) return;

        this._elapsedTime += this.network.simulation.timeStepInMS;
        this.changes.internalState = true;
        
        this._isActive = (this._elapsedTime >= this.time);
        // If "isActive" and "output" are different, that means that, during this resolve,
        // the "isActive" changed, and then, the "output" will change too, because "output"
        // is a reflex of "isActive"
        this.changes.output = (this.output !== this.isActive);
        this._output = this._isActive;
    }

}

export default timerOn