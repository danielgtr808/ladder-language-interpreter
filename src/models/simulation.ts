import Network from "./network";

class Simulation {

    networks: Network[] = [];

    constructor(public readonly timeStepInMS: number = 0.5) { }

}

export default Simulation