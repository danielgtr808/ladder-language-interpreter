import LadderCoordinates from "./ladder-element/ladder-coordinates";
import LadderElement from "./ladder-element/ladder-element";
import LadderElementConstructor from "./ladder-element/ladder-element-constructor";
import Simulation from "./simulation";

class Network {

    elements: LadderElement[] = [];
    
    private _nextElementId: number = 0;

    constructor(public readonly networkId: number, private _simulation: Simulation) { }

    calculateElementInput(element: LadderElement): boolean {
        if(element.coordinates.xInit == 0) return true;

        let elementInput: boolean = false;
        this.getPreviousElements(element).forEach(x => {
            elementInput = elementInput || x.output;
        })

        return elementInput;
    }

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

    getNextElements(referenceElement: LadderElement): LadderElement[] {
        return this.elements.filter(x => {
            return referenceElement.coordinates.xEnd == x.coordinates.xInit && (
                referenceElement.coordinates.yEnd == x.coordinates.yInit ||
                referenceElement.coordinates.yInit == x.coordinates.yEnd ||
                referenceElement.coordinates.yInit == x.coordinates.yInit
            );
        });
    }

    getPreviousElements(referenceElement: LadderElement): LadderElement[] {
        return this.elements.filter(x => {
            return referenceElement.coordinates.xInit == x.coordinates.xEnd && (
                referenceElement.coordinates.yInit == x.coordinates.yInit ||
                referenceElement.coordinates.yInit == x.coordinates.yEnd ||
                referenceElement.coordinates.yEnd == x.coordinates.yInit
                // the algorithm will take the reference element along with the
                // others, so, another condition is attached to prevent this.
            ) && referenceElement !== x ;
        });
    }

    play() {
        this.elements.filter(x => x.coordinates.xInit == 0).forEach(x => {
            x.input = true;
        })
    }

    resolve() {
        let elementsThatChanged = this.elements.filter(x => x.changed);
        for(let i = 0; i < elementsThatChanged.length; i++) {
            const actualElement = elementsThatChanged[i];
            actualElement.changed = false;
            actualElement.resolve();

            // A resolve calculates the new output of the element based on the input acquired
            // on the last resolve loop, so, the "changed" setted to false, can turn into true
            // gain, if the output changes.
            if(!actualElement.changed) continue;

            this.getNextElements(actualElement).forEach(x => {
                x.input = this.calculateElementInput(x);
                if(x.changed && x.hasNoPropagationTime) {
                    elementsThatChanged.push(x);
                }
            })

            actualElement.changed = false;
        }
    }

    stop() {
        this.elements.forEach(x => x.reset());
    }

}

export default Network