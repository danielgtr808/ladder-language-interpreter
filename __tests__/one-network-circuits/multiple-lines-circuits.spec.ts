import Simulation from "./../../src/models/simulation";
import NoInput from "./../../src/models/ladder-element/inputs/no-input";
import Coil from "./../../src/models/ladder-element/output/coil";
import CounterUp from "./../../src/models/ladder-element/counters/counter-up";
import LadderCoordinates from "../../src/models/ladder-element/ladder-coordinates";
import Line from "./../../src/models/ladder-element/line/line";
import NcInput from "./../../src/models/ladder-element/inputs/nc-input";

test(`Circuit with a counter connected to two noInput(one on count
    input and another on reset) connected to a simple output`, () => {
        const simulation = new Simulation(0.5);
        const network = simulation.createNetwork();

        const noInputCount = network.createElement(NoInput, new LadderCoordinates(0, 1, 0, 0));
        noInputCount.isActive = true;
        const noInputReset = network.createElement(NoInput, new LadderCoordinates(0, 1, 1, 1));
        const counterUp = network.createElement(CounterUp, new LadderCoordinates(1, 2, 0, 0));
        counterUp.presetValue = 2;
        const simpleOutput = network.createElement(Coil, new LadderCoordinates(2, 3, 0, 0));

        simulation.play();
        simulation.resolve();

        expect(counterUp.currentValue).toBe(1);

        noInputCount.isActive = false;
        simulation.resolve();

        noInputCount.isActive = true;
        simulation.resolve();

        expect(counterUp.currentValue).toBe(2);
        expect(simpleOutput.input).toBe(true);

        noInputReset.isActive = true;
        simulation.resolve();

        expect(counterUp.currentValue).toBe(0);
});

test(`Latching circuit without a break contact`, () => {
    const simulation = new Simulation(0.5);
    const network = simulation.createNetwork();

    const noInputStart = network.createElement(NoInput, new LadderCoordinates(0, 1, 0, 0));
    const line = network.createElement(Line, new LadderCoordinates(1, 1, 0, 1));
    const noInputLatch = network.createElement(NoInput, new LadderCoordinates(0, 1, 1, 1));
    noInputLatch.address = "Q0.0"
    const simpleOutput = network.createElement(Coil, new LadderCoordinates(1, 2, 0, 0));
    simpleOutput.address = "Q0.0"

    simulation.play();
    noInputStart.isActive = true;
    simulation.resolve();

    expect(noInputStart.output).toBe(true);
    expect(noInputLatch.output).toBe(false);
    expect(line.input).toBe(true);
    expect(line.output).toBe(true);
    expect(simpleOutput.input).toBe(true);
    expect(simpleOutput.isActive).toBe(false);
    expect(simpleOutput.output).toBe(false);

    simulation.resolve();

    expect(noInputLatch.isActive).toBe(true);
    expect(noInputLatch.output).toBe(false);
    expect(simpleOutput.isActive).toBe(true);
    expect(simpleOutput.output).toBe(true);

    simulation.resolve();

    expect(noInputLatch.output).toBe(true)

    noInputStart.isActive = false;
    simulation.resolve();

    expect(noInputStart.output).toBe(false);
    expect(noInputLatch.output).toBe(true);
    expect(simpleOutput.input).toBe(true);

    simulation.resolve();

    expect(noInputLatch.output).toBe(true);
    expect(simpleOutput.input).toBe(true);
});

test(`Latching circuit with a break contact`, () => {
    const simulation = new Simulation(0.5);
    const network = simulation.createNetwork();

    const noInputStart = network.createElement(NoInput, new LadderCoordinates(0, 1, 0, 0));
    const line = network.createElement(Line, new LadderCoordinates(1, 1, 0, 1));
    const noInputLatch = network.createElement(NoInput, new LadderCoordinates(0, 1, 1, 1));
    const ncInputBreak = network.createElement(NcInput, new LadderCoordinates(1, 2, 0, 0))
    noInputLatch.address = "Q0.0"
    const simpleOutput = network.createElement(Coil, new LadderCoordinates(2, 3, 0, 0));
    simpleOutput.address = "Q0.0"

    simulation.play();
    noInputStart.isActive = true;
    simulation.resolve();
    simulation.resolve();
    simulation.resolve();
    noInputStart.isActive = false;
    simulation.resolve();
    simulation.resolve();

    ncInputBreak.isActive = true;

    simulation.resolve();

    expect(simpleOutput.input).toBe(false);

    simulation.resolve();

    expect(noInputLatch.isActive).toBe(false);
    expect(noInputLatch.output).toBe(true);
    expect(simpleOutput.isActive).toBe(false);

    simulation.resolve()

    expect(noInputLatch.output).toBe(false);
});