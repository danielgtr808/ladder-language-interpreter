import Network from "./network";

class Simulation {

    networks: Network[] = [];

    private _nextNetworkId: number = 0;
    private _timeInMS: number = 0;

    constructor(public readonly timeStepInMS: number = 0.5) { }

    get timeInMS(): number {
        return this._timeInMS;
    }

    createNetwork(): Network {
        const newNetwork = new Network(this._nextNetworkId, this);
        this._nextNetworkId++;

        this.networks.push(newNetwork);
        return newNetwork;
    }

    resolve() {
        this.networks.forEach(x => x.resolve());
        this._timeInMS += this.timeStepInMS;
    }

}

export default Simulation