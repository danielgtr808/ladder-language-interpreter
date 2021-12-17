import MemoryManager from "./memory-manager/memory-manager";
import Network from "./network";

class Simulation {

    networks: Network[] = [];
    memoryManager: MemoryManager;

    private _nextNetworkId: number = 0;
    private _timeInMS: number = 0;

    constructor(public readonly timeStepInMS: number = 0.5) {
        this.memoryManager = new MemoryManager();
    }

    get timeInMS(): number {
        return this._timeInMS;
    }

    createNetwork(): Network {
        const newNetwork = new Network(this._nextNetworkId, this.memoryManager, this);
        this._nextNetworkId++;

        this.networks.push(newNetwork);
        return newNetwork;
    }

    play() {
        this.networks.forEach(x => x.play());
    }

    resolve() {
        this.networks.forEach(x => x.resolve());
        this._timeInMS += this.timeStepInMS;
    }

    stop() {
        this.networks.forEach(x => x.stop());
    }

}

export default Simulation