import Simulation from "./../../src/models/simulation";
import NoInput from "./../../src/models/ladder-element/inputs/no-input";
import Line from "./../../src/models/ladder-element/line/line";
import SimpleOutput from "./../../src/models/ladder-element/output/simple-output";
import timerOn from "./../../src/models/ladder-element/timers/timer-on";
import timerOff from "../../src/models/ladder-element/timers/timer-off";
import CTU from "./../../src/models/ladder-element/counters/CTU";
import NcInput from "./../../src/models/ladder-element/inputs/nc-input";
import LadderCoordinates from "../../src/models/ladder-element/ladder-coordinates";
import CTD from "./../../src/models/ladder-element/counters/CTD";

test("NoInput inactive, all lines should have negative input after resolve", () => {
    const simulation = new Simulation(0.5)
    const network = simulation.createNetwork();
    const noInput = network.createElement(NoInput, new LadderCoordinates(0, 1, 0, 0));
    const line = network.createElement(Line, new LadderCoordinates(1, 2, 0, 0));
    const line2 = network.createElement(Line, new LadderCoordinates(2, 3, 0, 0));

    simulation.play();
    simulation.resolve();

    expect(line.input).toBe(false)
    expect(line2.input).toBe(false)
});

test("NoInput is active, all lines should have positive input after resolve", () => {
    const simulation = new Simulation()
    const network = simulation.createNetwork();
    const noInput = network.createElement(NoInput, new LadderCoordinates(0, 1, 0, 0));
    noInput.isActive = true;
    const line = network.createElement(Line, new LadderCoordinates(1, 2, 0, 0));
    const line2 = network.createElement(Line, new LadderCoordinates(2, 3, 0, 0));

    simulation.play();
    simulation.resolve();
    
    expect(line.input).toBe(true);
    expect(line2.input).toBe(true);
});

test(`Active NoInput in series with lines and SimpleOutput at the end, 
          SimpleOutput input should be true at the first resolve and
          output should be true at the second resolve`, () => {
    const simulation = new Simulation(0.5)
    const network = simulation.createNetwork();
    const noInput = network.createElement(NoInput, new LadderCoordinates(0, 1, 0, 0));
    noInput.isActive = true;
    const line = network.createElement(Line, new LadderCoordinates(1, 2, 0, 0));
    const simpleOutput = network.createElement(SimpleOutput, new LadderCoordinates(2, 3, 0, 0));

    simulation.play();
    simulation.resolve();

    expect(simpleOutput.input).toBe(true);
    expect(simpleOutput.output).toBe(false);

    simulation.resolve();

    expect(simpleOutput.output).toBe(true);
});

test("TON in series with a simpleOutput, after two resolves, the simpleOutput input should be true", () => {
    const simulation = new Simulation(0.5)
    const network = simulation.createNetwork();
    const timerON = network.createElement(timerOn, new LadderCoordinates(0, 1, 0, 0));
    timerON.presetTime = 1;
    
    const simpleOutput = network.createElement(SimpleOutput, new LadderCoordinates(1, 2, 0, 0));

    simulation.play();
    simulation.resolve();

    expect(timerON.elapsedTime).toBe(0.5);
    expect(simpleOutput.input).toBe(false);

    simulation.resolve();

    expect(timerON.elapsedTime).toBe(1);
    expect(simpleOutput.input).toBe(true);
});

test("TOF with preset equal to 1, step in ms is equal to 1, the TOF output should wait 2 resolves to turn off", () => {
    const simulation = new Simulation(0.5)
    const network = simulation.createNetwork();
    const timerOFF = network.createElement(timerOff, new LadderCoordinates(0, 1, 0, 0));
    timerOFF.presetTime = 1;

    simulation.play();
    simulation.resolve();

    expect(timerOFF.elapsedTime).toBe(0.5);
    expect(timerOFF.output).toBe(true);

    simulation.resolve();

    expect(timerOFF.elapsedTime).toBe(1);
    expect(timerOFF.output).toBe(false)
    expect(simulation.timeInMS).toBe(1);
});

test("TOF with input equal to false, should not increase timeElapsed after resolves", () => {
    const simulation = new Simulation(0.5)
    const network = simulation.createNetwork();
    const timerOFF = network.createElement(timerOff, new LadderCoordinates(1, 2, 0, 0));
    timerOFF.presetTime = 1;  

    simulation.play();
    simulation.resolve();

    expect(timerOFF.elapsedTime).toBe(0);

    simulation.resolve();

    expect(timerOFF.elapsedTime).toBe(0);
});

test("Elements connected to true output should have the input true before the first resolve", () => {
    const simulation = new Simulation(0.5)
    const network = simulation.createNetwork();
    const timerOFF = network.createElement(timerOff, new LadderCoordinates(0, 1, 0, 0));
    const line = network.createElement(Line, new LadderCoordinates(1, 2, 0, 0));
    const simpleOutput = network.createElement(SimpleOutput, new LadderCoordinates(2, 3, 0, 0));

    simulation.play();

    expect(line.input).toBe(true);
    expect(simpleOutput.input).toBe(true);
});

test("If CTU input is high, and presetValue is 1, CTU output should be high after first resolve", () => {
    const simulation = new Simulation(0.5)
    const network = simulation.createNetwork();
    const counterUp = network.createElement(CTU, new LadderCoordinates(0, 1, 0, 0));
    counterUp.presetValue = 1;

    simulation.play();
    simulation.resolve();

    expect(counterUp.output).toBe(true);
    expect(counterUp.currentValue).toBe(1);
});

test("On creating CTU, should ocupy two coordinates on the network", () => {
    const simulation = new Simulation(0.5);
    const network = simulation.createNetwork();
    const counterUp = network.createElement(CTU, new LadderCoordinates(0, 1, 0, 0));

    expect(network.getElementByCoordinates(new LadderCoordinates(0, 1, 1, 1))).toEqual(counterUp);
    expect(network.getElementByCoordinates(new LadderCoordinates(0, 1, 1, 1))).toBeDefined();
})

test("On reseting the CTU, the presetValue should go to zero", () => {
    const simulation = new Simulation(0.5);
    const network = simulation.createNetwork();
    const ncInput = network.createElement(NcInput, new LadderCoordinates(0, 1, 0, 0));
    const noInput = network.createElement(NoInput, new LadderCoordinates(0, 1, 1, 1));
    const counterUp = network.createElement(CTU, new LadderCoordinates(1, 2, 0, 0));
    counterUp.presetValue = 10.

    simulation.play();
    simulation.resolve();

    expect(counterUp.currentValue).toBe(1);

    counterUp.setInput(true, noInput.coordinates.incrementX(1));

    simulation.resolve();

    expect(counterUp.currentValue).toBe(0);
})

test("On reseting the CTU, all the elements connected to it, should have negative input", () => {
    const simulation = new Simulation(0.5);
    const network = simulation.createNetwork();
    const counterUp = network.createElement(CTU, new LadderCoordinates(0, 1, 0, 0));
    const line = network.createElement(Line, new LadderCoordinates(1, 2, 0, 0));
    const simpleOutput = network.createElement(SimpleOutput, new LadderCoordinates(2, 3, 0, 0));
    counterUp.presetValue = 1;

    simulation.play();
    simulation.resolve();

    expect(counterUp.output).toBe(true);
    expect(line.input).toBe(true);
    expect(simpleOutput.input).toBe(true);

    counterUp.resetInput(true);
    simulation.resolve();

    expect(counterUp.output).toBe(false)
    expect(line.input).toBe(false);
    expect(simpleOutput.input).toBe(false);
})

test("If CTD input is high, and presetValue is 1, CTD output should be high after first resolve", () => {
    const simulation = new Simulation(0.5)
    const network = simulation.createNetwork();
    const counterDown = network.createElement(CTD, new LadderCoordinates(0, 1, 0, 0));
    counterDown.presetValue = 1;

    simulation.play();
    simulation.resolve();

    expect(counterDown.output).toBe(true);
    expect(counterDown.currentValue).toBe(0);
});

test("On reseting the CTD, the presetValue should go to zero", () => {
    const simulation = new Simulation(0.5);
    const network = simulation.createNetwork();
    const ncInput = network.createElement(NcInput, new LadderCoordinates(0, 1, 0, 0));
    const noInput = network.createElement(NoInput, new LadderCoordinates(0, 1, 1, 1));
    const counterDown = network.createElement(CTD, new LadderCoordinates(1, 2, 0, 0));
    counterDown.presetValue = 10.

    simulation.play();
    simulation.resolve();

    expect(counterDown.currentValue).toBe(9);

    counterDown.setInput(true, noInput.coordinates.incrementX(1));

    simulation.resolve();

    expect(counterDown.currentValue).toBe(10);
})