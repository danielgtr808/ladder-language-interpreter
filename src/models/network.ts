import LadderCoordinates from "./ladder-element/ladder-coordinates";
import LadderElement from "./ladder-element/ladder-element";
import LadderElementConstructor from "./ladder-element/ladder-element-constructor";
import Simulation from "./simulation";

class Network {

    elements: LadderElement[] = [];
    
    private _nextElementId: number = 0;

    constructor(public readonly networkId: number, private _simulation: Simulation) { }

    createElement<T extends LadderElement>(elementConstructor: LadderElementConstructor<T>, coordinates: LadderCoordinates): T {
        const newElement = new elementConstructor(coordinates, this._nextElementId, this);
        this._nextElementId++;

        const elementToReplace = this.getElementByCoordinates(coordinates);
        if(elementToReplace) {
            this.elements.splice(
                this.elements.findIndex(x => x == elementToReplace),
                1
            )
        }

        this.elements.push(newElement)
        return newElement;
    }

    getElementByCoordinates(coordinates: LadderCoordinates): LadderElement | undefined {
        return this.elements.find(x => 
            x.coordinates.xEnd == coordinates.xEnd &&
            x.coordinates.xInit == coordinates.xInit &&
            x.coordinates.yEnd == coordinates.yEnd &&
            x.coordinates.yInit == coordinates.yInit
        );
    }

    resolve() {
        this.elements.forEach(x => x.resolve());
    }

}

export default Network