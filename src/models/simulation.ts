import MemoryManager from "./memory-manager/memory-manager";
import Network from "./network";
import NetworkChanges from "./network-changes";

class Simulation {

    networks: Network[] = [];
    memoryManager: MemoryManager;

    private _nextNetworkId: number = 1;
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

    play(): NetworkChanges[] {
        let networkChanges: NetworkChanges[] = []
        this.networks.forEach(x => {
            const playReturn = x.play();

            if(playReturn.length > 0) {
                networkChanges.push({
                    networkId: x.id,
                    changedElements: playReturn
                });
            }
        });

        return networkChanges;
    }

    resolve() {
        this.networks.forEach(x => x.resolve());
        this._timeInMS += this.timeStepInMS;
    }

    stop() {
        this.networks.forEach(x => x.stop());
        this._timeInMS = 0;
    }

}

export default Simulation