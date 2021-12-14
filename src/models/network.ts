import LadderElement from "./ladder-element";
import Simulation from "./simulation";

class Network {

    elements: LadderElement[] = [];
    
    constructor(private _simulation: Simulation) { }

}

export default Network