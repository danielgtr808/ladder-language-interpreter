import LadderCoordinates from "./ladder-element/ladder-coordinates";
import LadderElement from "./ladder-element/ladder-element";
import LadderElementChanges from "./ladder-element/ladder-element-changes";
import LadderElementConstructor from "./ladder-element/ladder-element-constructor";
import Simulation from "./simulation";

type CoordinateInUse = {
    coordinates: LadderCoordinates,
    element: LadderElement
}

class Network {

    elements: LadderElement[] = [];
    
    private _coordinatesInUse: CoordinateInUse[] = []
    private _nextElementId: number = 0;

    constructor(public readonly networkId: number, public readonly simulation: Simulation) { }

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

        for(let y = 0; y < newElement.dimensions.height; y++) {
            for(let x = 0; x < newElement.dimensions.width; x++) {
                const calculatedCoordinates: LadderCoordinates = {
                    xEnd: coordinates.xEnd + x,
                    xInit: coordinates.xInit + x,
                    yEnd: coordinates.yEnd + y,
                    yInit: coordinates.yInit + y
                }
                const elementToReplace = this.getElementByCoordinates(calculatedCoordinates);

                if(!elementToReplace) {
                    this._coordinatesInUse.push({ coordinates: calculatedCoordinates, element: newElement })
                    continue;
                };

                this.elements.splice(this.elements.findIndex(x => x == elementToReplace), 1);
                // The "!" after the find function means that, it's guaranteed that the
                // object will be founded. Thats because, the same function that create
                // the elements (this function) also pushes then into usable coordinates
                // array, so, it's guaranted that they will be founded. 
                this._coordinatesInUse.find(x => x.element == elementToReplace)!.element = newElement;
            }
        }

        this.elements.push(newElement)
        return newElement;
    }

    getElementByCoordinates(coordinates: LadderCoordinates): LadderElement | undefined {
        return this._coordinatesInUse.find(x => 
            x.coordinates.xEnd == coordinates.xEnd &&
            x.coordinates.xInit == coordinates.xInit &&
            x.coordinates.yEnd == coordinates.yEnd &&
            x.coordinates.yInit == coordinates.yInit
        )?.element;
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
        });
        this.firstResolve();
    }

    resolve(): LadderElement[] {
        let elementsThatChanged = this.elements.filter(x => this.hasElementchanged(x.changes));
        for(let i = 0; i < elementsThatChanged.length; i++) {
            const actualElement = elementsThatChanged[i];
            actualElement.changes.input = false;
            actualElement.changes.internalState = false;
            actualElement.resolve();

            // A resolve calculates the new output of the element based on the input acquired
            // on the last resolve loop, so, the "changed" setted to false, can turn into true
            // gain, if the output changes.
            if(!actualElement.changes.output) continue;

            this.getNextElements(actualElement).forEach(x => {
                x.input = this.calculateElementInput(x);
                if(x.changes && x.hasNoActivationTime) {
                    elementsThatChanged.push(x);
                }
            })

            actualElement.changes.output = false;
        }

        return elementsThatChanged;
    }

    stop() {
        this.elements.forEach(x => x.reset());
    }

    private firstResolve() {
        // The first resolve is distinct from the others, because, in this case,
        // it's used only to propagate the state from the elements that start with
        // a "output" equal to "true". No "resolve" is done for the elements that
        // have an activation time.
        let initialElements = this.elements.filter(x => x.output);
        for(let i = 0; i < initialElements.length; i++) {
            const actualElement = initialElements[i];
            if(actualElement.hasNoActivationTime) actualElement.resolve();
            
            this.getNextElements(actualElement).forEach(x => {
                x.input = this.calculateElementInput(x);
                if(x.changes && x.hasNoActivationTime) {
                    initialElements.push(x);
                }
            })
        }

        return initialElements;
    }


    private hasElementchanged(changesObject: LadderElementChanges): boolean {
        for (let value of Object.values(changesObject)) {
            if(value) return value;
        }

        return false;
    }

}

export default Network