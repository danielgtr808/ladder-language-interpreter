import LadderCoordinates from "./ladder-element/ladder-coordinates";
import LadderElement from "./ladder-element/ladder-element";
import LadderElementChanges from "./ladder-element/ladder-element-changes";
import LadderElementConstructor from "./ladder-element/ladder-element-constructor";
import BitAddress from "./memory-manager/bit-address";
import MemoryManager from "./memory-manager/memory-manager";
import Simulation from "./simulation";

type CoordinateInUse = {
    coordinates: LadderCoordinates,
    element: LadderElement
}

class Network {

    elements: LadderElement[] = [];
    
    private _coordinatesInUse: CoordinateInUse[] = []
    private _nextElementId: number = 1;

    constructor(
        public readonly id: number,
        public readonly memoryManager: MemoryManager,
        public readonly simulation: Simulation
    ) { }

    calculateElementInput(element: LadderElement): boolean {
        if(element.coordinates.xInit == 0) return true;

        let elementInput: boolean = false;
        this.getPreviousElements(element).forEach(x => {
            elementInput = elementInput || x.output;
        })

        return elementInput;
    }

    createElement<T extends LadderElement>(elementConstructor: LadderElementConstructor<T>, coordinates: LadderCoordinates): T {
        const newElement = new elementConstructor(this.getBitAddress(""), coordinates, this._nextElementId, this);
        this._nextElementId++;

        for(let y = 0; y < newElement.height; y++) {
            const calculatedCoordinates = coordinates.incrementY(y);
            const elementToDelete = this.getElementByCoordinates(calculatedCoordinates);

            if(elementToDelete) this.deleteElement(elementToDelete);

            this._coordinatesInUse.push({
                coordinates: calculatedCoordinates,
                element: newElement
            });
        }

        this.elements.push(newElement)
        return newElement;
    }

    getBitAddress(address: string): BitAddress {
        return this.memoryManager.findOrCreateBitAddress(address);
    }

    getElementByCoordinates(coordinates: LadderCoordinates): LadderElement | undefined {
        return this._coordinatesInUse.find(x => x.coordinates.areEqual(coordinates))?.element;
    }

    getNextElements(referenceElement: LadderElement): LadderElement[] {
        return this._coordinatesInUse
            .filter(x => 
                x.coordinates.isNextCoordinate(referenceElement.coordinates) && x.element !== referenceElement
            ).map(
                x => x.element
            );
    }

    getPreviousElements(referenceElement: LadderElement): LadderElement[] {
        return this.elements.filter(x => 
            referenceElement.coordinates.isPreviousCoordinate(x.coordinates)
            // the algorithm will take the reference element along with the
            // others, so, another condition is attached to prevent this.
            && referenceElement !== x
        );
    }

    play(): LadderElement[] {
        this.elements.filter(x => x.coordinates.xInit == 0).forEach(x => {
            x.setInput(true, x.coordinates);
        });
        this.firstResolve();

        return this.elements.filter(x => this.hasElementchanged(x.changes));
    }

    resolve(): LadderElement[] {
        let elementsThatChanged = this.elements.filter(x => this.hasElementchanged(x.changes));
        for(let i = 0; i < elementsThatChanged.length; i++) {
            const actualElement = elementsThatChanged[i];
            actualElement.changes.input = false;
            actualElement.changes.internalState = false;
            actualElement.resolve();

            if(!actualElement.changes.output) continue;

            this.getNextElements(actualElement).forEach(x => {
                x.setInput(this.calculateElementInput(x), actualElement.coordinates.incrementX(1));
                if(this.hasElementchanged(x.changes) && x.hasNoActivationTime) {
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

    private deleteElement(elementToDelete: LadderElement) {
        this.elements.splice(this.elements.findIndex(x => x == elementToDelete), 1);

        let quantityReplaced: number = 0;
        for(let i = 0; i < this._coordinatesInUse.length; i++) {
            const actualElement = this._coordinatesInUse[i];
            if(actualElement.element != elementToDelete) continue;

            this._coordinatesInUse.splice(this._coordinatesInUse.findIndex(x => x.element == elementToDelete ))
            i--

            quantityReplaced++;
            if(quantityReplaced == elementToDelete.height) break;
        }
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
                x.setInput(this.calculateElementInput(x), x.coordinates.incrementX(1));
                if(x.changes && x.hasNoActivationTime) {
                    initialElements.push(x);
                }
            })
        }
    }

    private hasElementchanged(changesObject: LadderElementChanges): boolean {
        for (let value of Object.values(changesObject)) {
            if(value) return value;
        }

        return false;
    }

}

export default Network