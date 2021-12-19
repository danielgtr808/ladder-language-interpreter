import CounterDown from "../../src/models/ladder-element/counters/counter-down";
import Network from "../../src/models/network"
import NoInput from "./../../src/models/ladder-element/inputs/no-input";
import Simulation from "../../src/models/simulation";
import LadderCoordinates from "../../src/models/ladder-element/ladder-coordinates";
import Line from "../../src/models/ladder-element/line/line";
import BitAddress from "../../src/models/memory-manager/bit-address";

describe("calculateElementInput", () => {
    let network: Network;

    beforeEach(() => {
        network = new Simulation().createNetwork();
    });

    test("If element xInit is 0, then the input should be", () => {
        const noInput = network.createElement(NoInput, new LadderCoordinates(0, 1, 0, 0));
        expect(network.calculateElementInput(noInput)).toBe(true)
    });

    test("The result should be true with at least one true output", () => {
        const verticalLineOne = network.createElement(Line, new LadderCoordinates(1, 1, 0, 1))
        const horizontalLine = network.createElement(Line, new LadderCoordinates(0, 1, 1, 1));
        horizontalLine.setInput(true, horizontalLine.coordinates);
        horizontalLine.resolve();
        const verticalLineTwo = network.createElement(Line, new LadderCoordinates(1, 1, 1, 2));
        const noInput = network.createElement(NoInput, new LadderCoordinates(1, 2, 1, 1));

        expect(network.calculateElementInput(noInput)).toBe(true);
    });

    test("The result should be false if there is no true output", () => {
        const verticalLineOne = network.createElement(Line, new LadderCoordinates(1, 1, 0, 1))
        const horizontalLine = network.createElement(Line, new LadderCoordinates(0, 1, 1, 1));
        const verticalLineTwo = network.createElement(Line, new LadderCoordinates(1, 1, 1, 2));
        const noInput = network.createElement(NoInput, new LadderCoordinates(1, 2, 1, 1));

        expect(network.calculateElementInput(noInput)).toBe(false);
    });

    test("For vertical elements, the result should be true with the the bottom left element output being true", () => {
        const verticalLine = network.createElement(Line, new LadderCoordinates(1, 1, 0, 1))
        const horizontalLine = network.createElement(Line, new LadderCoordinates(0, 1, 1, 1));
        horizontalLine.setInput(true, horizontalLine.coordinates);
        horizontalLine.resolve();

        expect(network.calculateElementInput(verticalLine)).toBe(true)
    });
});

describe("createElement", () => {
    let simulation: Simulation;
    let network: Network;
    let lineOne: Line;
    let lineTwo: Line;

    beforeEach(() => {
        simulation = new Simulation();
        network = simulation.createNetwork();
        lineOne = network.createElement(Line, new LadderCoordinates(0, 1, 0, 0));
        lineTwo = network.createElement(Line, new LadderCoordinates(1, 2, 0, 0));
    });

    test("Check if each element created is send to the 'elements' property", () => {        
        expect(network.elements.length).toBe(2);
        expect(network.elements.includes(lineOne)).toBe(true);
        expect(network.elements.includes(lineTwo)).toBe(true);
    });

    test("Each element created must have a distinct id", () => {
        expect(lineOne.id).toBe(1);
        expect(lineTwo.id).toBe(2);
    });

    test("New element must replace the others with the same coordinate", () => {
        const lineThree = network.createElement(Line, lineOne.coordinates);
        expect(network.getElementByCoordinates(lineOne.coordinates)).toBe(lineThree);
    });

    test("Elements with height greather than one must occupy more than one coordinate", () => {
        const CTD = network.createElement(CounterDown, lineOne.coordinates);

        expect(network.getElementByCoordinates(lineOne.coordinates)).toBe(CTD);
        expect(network.getElementByCoordinates(lineOne.coordinates.incrementY(1))).toBe(CTD);
    });

    test(`Elements replaced by smaller elements should have all coordinates
          replaced (not occupied coordinates should be deleted)`, () => {
        const CTD = network.createElement(CounterDown, lineOne.coordinates);
        const line = network.createElement(Line, lineOne.coordinates);

        expect(network.getElementByCoordinates(lineOne.coordinates)).toBe(line);
        expect(network.getElementByCoordinates(lineOne.coordinates.incrementY(1))).toBeUndefined();
    });
});

describe("getBitAddress", () => {
    test("Check if the method 'findOrCreateBitAddress' of memoryManager is called", () => {
        const simulation: Simulation = new Simulation();
        const mockFindOrCreatedBitAddressMemoryManager = jest.fn((address: string) => { return new BitAddress(""); });
        simulation.memoryManager.findOrCreateBitAddress = mockFindOrCreatedBitAddressMemoryManager;
        const network: Network = simulation.createNetwork();

        network.getBitAddress("");
        expect(mockFindOrCreatedBitAddressMemoryManager.mock.calls.length).toBe(1);
    });
});

describe('getElementByCoordinates', () => {
    let simulation: Simulation;
    let network: Network;

    beforeEach(() => {
        simulation = new Simulation();
        network = simulation.createNetwork();
    });

    test("Check if the correct element is returned by the function", () => {
        const line: Line = network.createElement(Line, new LadderCoordinates(0, 1, 0, 0));

        expect(network.getElementByCoordinates(line.coordinates)).toBe(line);
    });

    test("Check if the elements with height greather than one can be returned from more than one coordinate", () => {
        const CTD: CounterDown = network.createElement(CounterDown, new LadderCoordinates(0, 1, 0, 0))
        
        expect(network.getElementByCoordinates(CTD.coordinates)).toBe(CTD);
        expect(network.getElementByCoordinates(CTD.coordinates.incrementY(1))).toBe(CTD);
    });
});

describe("getNextElements", () => {
    let simulation: Simulation;
    let network: Network;

    beforeEach(() => {
        simulation = new Simulation();
        network = simulation.createNetwork();
    });

    test("Check next element for vertical line", () => {
        const topVerticalLine = network.createElement(Line, new LadderCoordinates(1, 1, 0, 1));
        const topHorizontalLine = network.createElement(Line, new LadderCoordinates(1, 2, 1, 1));
        const verticalLine = network.createElement(Line, new LadderCoordinates(1, 1, 1, 2));
        const bottomHorizontalLine = network.createElement(Line, new LadderCoordinates(1, 2, 2, 2));
        const bottomVerticalLine = network.createElement(Line, new LadderCoordinates(1, 1, 2, 1));

        const nextElements = network.getNextElements(verticalLine);

        expect(nextElements.length).toBe(4);
    })
})

// (getNextElements) based on a grid of elements, check if nextElements are getted correctly (leftmost, rightmost, at the top, bottom, and middle --- check vertical and horizontal elements, only)
// (getPreviousElements) same as previous method
// (play) check if set input is called for every element in the x = 0;
// (play) check the propagation of elements that start with output = true;
// (play -add layer) check if lines from x0 propagates to other lines.
// (resolve) check if all elements with changed have the "resolve" method called.
// (resolve) check if chaining of elements occour (if the elements connected to a changed output are called)
// (resolve) check if all changed elements are returned;
// (stop) check if all elements have the "reset" function called