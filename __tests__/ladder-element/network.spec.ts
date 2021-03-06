import BitAddress from "../../src/models/memory-manager/bit-address";
import CounterDown from "../../src/models/ladder-element/counters/counter-down";
import LadderCoordinates from "../../src/models/ladder-element/ladder-coordinates";
import Line from "../../src/models/ladder-element/line/line";
import Network from "../../src/models/network"
import NoInput from "./../../src/models/ladder-element/inputs/no-input";
import Simulation from "../../src/models/simulation";
import TimerOff from "../../src/models/ladder-element/timers/timer-off";

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

    test("Check next element for vertical element", () => {
        const topVerticalLine = network.createElement(Line, new LadderCoordinates(1, 1, 0, 1));
        const backTopHorizontalLine = network.createElement(Line, new LadderCoordinates(0, 1, 1, 1));
        const frontTopHorizontalLine = network.createElement(Line, new LadderCoordinates(1, 2, 1, 1));
        const verticalLine = network.createElement(Line, new LadderCoordinates(1, 1, 1, 2));
        const backBottomHorizontalLine = network.createElement(Line, new LadderCoordinates(0, 1, 2, 2));
        const frontBottomHorizontalLine = network.createElement(Line, new LadderCoordinates(1, 2, 2, 2));
        const bottomVerticalLine = network.createElement(Line, new LadderCoordinates(1, 1, 2, 1));

        const nextElements = network.getNextElements(verticalLine);

        expect(nextElements.length).toBe(4);
        expect(nextElements.includes(topVerticalLine)).toBe(true);
        expect(nextElements.includes(frontTopHorizontalLine)).toBe(true);
        expect(nextElements.includes(frontBottomHorizontalLine)).toBe(true);
        expect(nextElements.includes(bottomVerticalLine)).toBe(true);
    });

    test("Check next element for horizontal element", () => {
        const backTopVerticalLine = network.createElement(Line, new LadderCoordinates(1, 1, 0, 1));
        const frontTopVerticalLine = network.createElement(Line, new LadderCoordinates(2, 2, 0, 1));
        const horizontalElement = network.createElement(Line, new LadderCoordinates(1, 2, 1, 1));
        const frontHorizontalLine = network.createElement(Line, new LadderCoordinates(2, 3, 1, 1));
        const backBottomVerticalLine = network.createElement(Line, new LadderCoordinates(1, 1, 1, 2));
        const frontBottomVerticalLine = network.createElement(Line, new LadderCoordinates(2, 2, 1, 2));

        const nextElements = network.getNextElements(horizontalElement);

        expect(nextElements.length).toBe(3);
        expect(nextElements.includes(frontTopVerticalLine)).toBe(true);
        expect(nextElements.includes(frontHorizontalLine)).toBe(true);
        expect(nextElements.includes(frontBottomVerticalLine)).toBe(true);
    });
});

describe("getPreviousElements", () => {
    let simulation: Simulation;
    let network: Network;

    beforeEach(() => {
        simulation = new Simulation();
        network = simulation.createNetwork();
    });

    test("Check previous element for vertical element", () => {
        const topVerticalLine = network.createElement(Line, new LadderCoordinates(1, 1, 0, 1));
        const topHorizontalLine = network.createElement(Line, new LadderCoordinates(0, 1, 1, 1));
        const verticalLine = network.createElement(Line, new LadderCoordinates(1, 1, 1, 2));
        const bottomHorizontalLine = network.createElement(Line, new LadderCoordinates(0, 1, 2, 2));
        const bottomVerticalLine = network.createElement(Line, new LadderCoordinates(1, 1, 2, 3));

        const previousElements = network.getPreviousElements(verticalLine);

        expect(previousElements.length).toBe(3);
        expect(previousElements.includes(topVerticalLine)).toBe(true);
        expect(previousElements.includes(topHorizontalLine)).toBe(true);
        expect(previousElements.includes(bottomHorizontalLine)).toBe(true);
    });

    test("Check next element for horizontal element", () => {
        const topVerticalLine = network.createElement(Line, new LadderCoordinates(1, 1, 0, 1));
        const horizontalLine = network.createElement(Line, new LadderCoordinates(1, 2, 1, 1));
        const backHorizontalLine = network.createElement(Line, new LadderCoordinates(0, 1, 1, 1));
        const bottomVerticalLine = network.createElement(Line, new LadderCoordinates(1, 1, 1, 2));

        const previousElements = network.getPreviousElements(horizontalLine);

        expect(previousElements.length).toBe(3);
        expect(previousElements.includes(topVerticalLine)).toBe(true);
        expect(previousElements.includes(backHorizontalLine)).toBe(true);
        expect(previousElements.includes(bottomVerticalLine)).toBe(true);
    });
});

describe("play", () => {
    let simulation: Simulation;
    let network: Network;

    beforeEach(() => {
        simulation = new Simulation();
        network = simulation.createNetwork();
    });

    test("Check if 'setInput' is called for every element in the xInit = 0", () => {
        const firstLine = network.createElement(Line, new LadderCoordinates(0, 1, 0, 0));
        const setInputMockFirstLine = jest.fn((value: boolean, coordinate: LadderCoordinates) => { });
        firstLine.setInput = setInputMockFirstLine;

        const secondLine = network.createElement(Line, new LadderCoordinates(0, 1, 1, 1));
        const setInputMockSecondLine = jest.fn((value: boolean, coordinate: LadderCoordinates) => { });
        secondLine.setInput = setInputMockSecondLine;

        network.play();

        expect(setInputMockFirstLine.mock.calls.length).toBe(1);
        expect(setInputMockSecondLine.mock.calls.length).toBe(1);
    });

    test("Check if elements that starts with high output propagates it's signal to other elements", () => {
        const TOF = network.createElement(TimerOff, new LadderCoordinates(1, 2, 0, 0));
        const firstLine = network.createElement(Line, new LadderCoordinates(2, 3, 0, 0));
        const secondLine = network.createElement(Line, new LadderCoordinates(3, 4, 0, 0));

        network.play();

        expect(firstLine.input).toBe(true);
        expect(secondLine.input).toBe(true);
    });

    // (play -add layer) check if lines from x0 propagates to other lines.
});

describe("resolve", () => {
    let simulation: Simulation;
    let network: Network;

    beforeEach(() => {
        simulation = new Simulation();
        network = simulation.createNetwork();
    });

    test("All elements considered changed must have the method 'resolve' called.", () => {
        const changedElement = network.createElement(Line, new LadderCoordinates(1, 2, 0, 0));
        changedElement.changes.input = true;
        const resolveMockChangedElement = jest.fn(() => { });
        changedElement.resolve = resolveMockChangedElement;

        const secondChangedElement = network.createElement(Line, new LadderCoordinates(2, 3, 0, 0));
        secondChangedElement.changes.input = true;
        const resolveMockSecondChangedElement = jest.fn(() => { });
        secondChangedElement.resolve = resolveMockSecondChangedElement;

        const elementNotChanged = network.createElement(Line, new LadderCoordinates(1, 2, 1, 1));
        const resolveMockElementNotChanged = jest.fn(() => { });
        elementNotChanged.resolve = resolveMockElementNotChanged;

        network.resolve();

        expect(resolveMockChangedElement.mock.calls.length).toBe(1);
        expect(resolveMockSecondChangedElement.mock.calls.length).toBe(1);
        expect(resolveMockElementNotChanged.mock.calls.length).toBe(0);
    });

    test("Check if the signal is propagated to connected elements", () => { 
        const firstLine = network.createElement(Line, new LadderCoordinates(0, 1, 0, 0));
        firstLine.setInput(true, firstLine.coordinates);
        const secondLine = network.createElement(Line, new LadderCoordinates(1, 2, 0, 0));
        const thirdLine = network.createElement(Line, new LadderCoordinates(2, 3, 0, 0));
        const fourthLine = network.createElement(Line, new LadderCoordinates(3, 4, 0, 0));

        network.resolve();

        expect(secondLine.input).toBe(true);
        expect(thirdLine.input).toBe(true);
        expect(fourthLine.input).toBe(true);
    });

    test("Check if the signal is only propagate from left to right", () => {
        const firstLine = network.createElement(Line, new LadderCoordinates(0, 1, 0, 0));
        firstLine.setInput(true, firstLine.coordinates);
        const secondLine = network.createElement(Line, new LadderCoordinates(1, 2, 0, 0));
        const thirdLine = network.createElement(Line, new LadderCoordinates(2, 3, 0, 0));
        const fourthLine = network.createElement(Line, new LadderCoordinates(3, 4, 0, 0));
        const verticalLine = network.createElement(Line, new LadderCoordinates(4, 4, 0, 1));
        const fifithLine = network.createElement(Line, new LadderCoordinates(4, 5, 1, 1));
        const parallelFourthLine = network.createElement(Line, new LadderCoordinates(3, 4, 1, 1));
        const parallelThirdLine = network.createElement(Line, new LadderCoordinates(2, 3, 1, 1));
        const parallelSecondLine = network.createElement(Line, new LadderCoordinates(1, 2, 1, 1));

        network.resolve();

        expect(secondLine.input).toBe(true);
        expect(thirdLine.input).toBe(true);
        expect(fourthLine.input).toBe(true);
        expect(verticalLine.input).toBe(true);
        expect(fifithLine.input).toBe(true);
        
        expect(parallelSecondLine.input).toBe(false);
        expect(parallelThirdLine.input).toBe(false);
        expect(parallelFourthLine.input).toBe(false);        
    });

    test("Check if the method is returning all the changed elements", () => {
        const firstLine = network.createElement(Line, new LadderCoordinates(0, 1, 0, 0));
        firstLine.setInput(true, firstLine.coordinates);
        const secondLine = network.createElement(Line, new LadderCoordinates(1, 2, 0, 0));
        const thirdLine = network.createElement(Line, new LadderCoordinates(2, 3, 0, 0));
        const fourthLine = network.createElement(Line, new LadderCoordinates(3, 4, 0, 0));
        const verticalLine = network.createElement(Line, new LadderCoordinates(4, 4, 0, 1));
        const fifithLine = network.createElement(Line, new LadderCoordinates(4, 5, 1, 1));
        const parallelFourthLine = network.createElement(Line, new LadderCoordinates(3, 4, 1, 1));
        const parallelThirdLine = network.createElement(Line, new LadderCoordinates(2, 3, 1, 1));
        const parallelSecondLine = network.createElement(Line, new LadderCoordinates(1, 2, 1, 1));

        const changedElements = network.resolve();

        expect(changedElements.length).toBe(6);
        expect(changedElements.includes(firstLine)).toBe(true);
        expect(changedElements.includes(secondLine)).toBe(true);
        expect(changedElements.includes(thirdLine)).toBe(true);
        expect(changedElements.includes(fourthLine)).toBe(true);
        expect(changedElements.includes(verticalLine)).toBe(true);
        expect(changedElements.includes(fifithLine)).toBe(true);      
    });
});

describe("stop", () => {
    test("Check if all elements have the 'reset' function called", () => {
        const simulation = new Simulation();
        const network = simulation.createNetwork();

        const firstElement = network.createElement(Line, new LadderCoordinates(0, 1, 0, 0));
        const resetMockFirstElement = jest.fn(() => { });
        firstElement.reset = resetMockFirstElement;

        const secondElement = network.createElement(Line, new LadderCoordinates(1, 2, 0, 0));
        const resetMockSecondElement = jest.fn(() => { });
        secondElement.reset = resetMockSecondElement;

        const thirdElement = network.createElement(Line, new LadderCoordinates(2, 3, 0, 0));
        const resetMockThidElement = jest.fn(() => { });
        thirdElement.reset = resetMockThidElement;

        network.stop();

        expect(resetMockFirstElement.mock.calls.length).toBe(1);
        expect(resetMockSecondElement.mock.calls.length).toBe(1);
        expect(resetMockThidElement.mock.calls.length).toBe(1);
    });
});