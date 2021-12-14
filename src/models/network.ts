import LadderElement from "./ladder-element/ladder-element";
import Simulation from "./simulation";

class Network {

    elements: LadderElement[] = [];
    
    constructor(public readonly networkId: number, private _simulation: Simulation) { }

    resolve() {
        this.elements.forEach(x => x.resolve());
    }

}

export default Network