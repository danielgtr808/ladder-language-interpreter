import BitAddress from "../../memory-manager/bit-address";
import Network from "../../network";
import LadderCoordinates from "../ladder-coordinates";
import LadderDimensions from "../ladder-dimensions";
import LadderElement from "../ladder-element";
import LadderElementChanges from "../ladder-element-changes";

class NcInput implements LadderElement {

    changes: LadderElementChanges = { input: false, internalState: false, output: false };
    readonly dimensions: LadderDimensions = { height: 1, width: 1 };
    readonly hasNoActivationTime: boolean = false;
    private _input: boolean = false;
    private _isActive: boolean = false;
    private _output: boolean = false;

    constructor(
        private _bitAddress: BitAddress,
        public readonly coordinates: LadderCoordinates,
        public readonly id: number,
        public readonly network: Network
    ) {
        this._bitAddress.subscribe(this.stateChangedCallback.bind(this));
    }

    get address(): string {
        return this._bitAddress.address;
    }
    
    set address(value: string) {
        const previousState = this.isActive;
        this._bitAddress.unsubscribe(this.stateChangedCallback.bind(this))

        this._bitAddress = this.network.getBitAddress(value);
        this._bitAddress.subscribe(this.stateChangedCallback.bind(this))
        
        this.changes.internalState = (previousState != this.isActive);
    }

    get input(): boolean {
        return this._input;
    }

    get output(): boolean {
        return this._output;
    }

    get isActive(): boolean {
        return this._isActive;
    }

    set isActive(value: boolean) {
        if(this.isActive == value) return;
        this._bitAddress.state = value;
    }

    reset(): void {
        this._input = false;
        this.isActive = false;
        this._output = false;
        this.changes = { input: false, internalState: false, output: false };
    }

    resolve(): void {
        if(this.output == (this.input && !this.isActive)) return;
        this._output = !this.output
        this.changes.output = true;
    }

    setInput(value: boolean, segmentCoordinates: LadderCoordinates): void {
        if(this.input == value) return;
        this._input = value;
        this.changes.input = true;
    }

    private stateChangedCallback(state: boolean) {
        this.changes.internalState = this.isActive !== state;
        this._isActive = state;
    }

}

export default NcInput