import Coil from "./../../src/models/ladder-element/output/coil";
import LadderCoordinates from "../../src/models/ladder-element/ladder-coordinates";
import Line from "./../../src/models/ladder-element/line/line";
import Network from "../../src/models/network";
import NcInput from "./../../src/models/ladder-element/inputs/nc-input";
import NoInput from "./../../src/models/ladder-element/inputs/no-input";
import Simulation from "./../../src/models/simulation";
import TimerOff from "../../src/models/ladder-element/timers/timer-off";

describe("createNetwork", () => {
    let simulation: Simulation;
    let firstNetwork: Network;
    let secondNetwork: Network;

    beforeEach(() => {
        simulation = new Simulation();
        firstNetwork = simulation.createNetwork();
        secondNetwork = simulation.createNetwork();
    })

    test("Check if each network created is send to the 'networks' property", () => {
        expect(simulation.networks.length).toBe(2);
        expect(simulation.networks.includes(firstNetwork)).toBe(true);
        expect(simulation.networks.includes(secondNetwork)).toBe(true);
    });

    test("Check if each network created has a distinct id", () => {
        expect(firstNetwork.id).toBe(1);
        expect(secondNetwork.id).toBe(2);
    });
});

describe("play", () => {
    let simulation: Simulation;
    let firstNetwork: Network;
    let secondNetwork: Network;

    beforeEach(() => {
        simulation = new Simulation();
        firstNetwork = simulation.createNetwork();
        secondNetwork = simulation.createNetwork();
    })

    test("Check if the method 'play' is called for all networks", () => {
        const mockPlayFirstNetwork = jest.fn(() => []);
        firstNetwork.play = mockPlayFirstNetwork;

        const mockPlaySecondNetwork = jest.fn(() => []);
        secondNetwork.play = mockPlaySecondNetwork;

        simulation.play();

        expect(mockPlayFirstNetwork.mock.calls.length).toBe(1);
        expect(mockPlaySecondNetwork.mock.calls.length).toBe(1);
    });

    test("Check if the method is returning the correct changes", () => {
        const noInput = firstNetwork.createElement(NoInput, new LadderCoordinates(0, 1, 0, 0));
        firstNetwork.createElement(Line, new LadderCoordinates(1, 2, 0, 0));

        const playReturn = simulation.play();
        expect(playReturn.length).toBe(1);
        expect(playReturn[0].networkId).toBe(1)
        expect(playReturn[0].changedElements.length).toBe(1);
        expect(playReturn[0].changedElements[0]).toBe(noInput);
    });

    test("Check if the method is returning the correct changes", () => {
        firstNetwork.createElement(TimerOff, new LadderCoordinates(1, 2, 0, 0));
        const line = firstNetwork.createElement(Line, new LadderCoordinates(2, 3, 0, 0));
        const coil = firstNetwork.createElement(Coil, new LadderCoordinates(3, 4, 0, 0));

        const playReturn = simulation.play();
        expect(playReturn.length).toBe(1);
        expect(playReturn[0].networkId).toBe(1)
        expect(playReturn[0].changedElements.length).toBe(2);
        expect(playReturn[0].changedElements[0]).toBe(line);
        expect(playReturn[0].changedElements[1]).toBe(coil);
    });
});

// (resolve) Check if the method "resolve" is called in all networks.
// (resolve) Check if simulation time is incremented
// (resolve) Check if the simulation is returning the correct changes.
// (stop) Check if the "stop" method is called in all networks
// (stop) Check if the simulation time is set to zero

describe("resolve", () => {
    let simulation: Simulation;
    let firstNetwork: Network;
    let secondNetwork: Network;

    beforeEach(() => {
        simulation = new Simulation();
        firstNetwork = simulation.createNetwork();
        secondNetwork = simulation.createNetwork();
    })

    test("Check if the method 'resolve' is called for all networks", () => {
        const mockResolveFirstNetwork = jest.fn(() => []);
        firstNetwork.resolve = mockResolveFirstNetwork;

        const mockResolveSecondNetwork = jest.fn(() => []);
        secondNetwork.resolve = mockResolveSecondNetwork;

        simulation.resolve();

        expect(mockResolveFirstNetwork.mock.calls.length).toBe(1);
        expect(mockResolveSecondNetwork.mock.calls.length).toBe(1);
    });
});