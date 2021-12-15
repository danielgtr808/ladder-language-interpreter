import Simulation from "./../../src/models/simulation";
import NoInput from "./../../src/models/ladder-element/inputs/no-input";
import Line from "./../../src/models/ladder-element/line/line";
import SimpleOutput from "./../../src/models/ladder-element/output/simple-output";
import TON from "./../../src/models/ladder-element/timers/TON"

test("NoInput inactive, all lines should have negative input after resolve", () => {
    const simulation = new Simulation(0.5)
    const network = simulation.createNetwork();
    const noInput = network.createElement(NoInput, { xInit: 0, xEnd: 1, yInit: 0, yEnd: 0 });
    const line = network.createElement(Line, { xInit: 1, xEnd: 2, yInit: 0, yEnd: 0 });
    const line2 = network.createElement(Line, { xInit: 2, xEnd: 3, yInit: 0, yEnd: 0 });

    simulation.play();
    simulation.resolve();

    expect(line.input).toBe(false)
    expect(line2.input).toBe(false)
});

test("NoInput is active, all lines should have positive input after resolve", () => {
    const simulation = new Simulation()
    const network = simulation.createNetwork();
    const noInput = network.createElement(NoInput, { xInit: 0, xEnd: 1, yInit: 0, yEnd: 0 });
    noInput.isActive = true;
    const line = network.createElement(Line, { xInit: 1, xEnd: 2, yInit: 0, yEnd: 0 });
    const line2 = network.createElement(Line, { xInit: 2, xEnd: 3, yInit: 0, yEnd: 0 });

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
    const noInput = network.createElement(NoInput, { xInit: 0, xEnd: 1, yInit: 0, yEnd: 0 });
    noInput.isActive = true;
    const line = network.createElement(Line, { xInit: 1, xEnd: 2, yInit: 0, yEnd: 0 });
    const simpleOutput = network.createElement(SimpleOutput, { xInit: 2, xEnd: 3, yInit: 0, yEnd: 0 })

    simulation.play();
    simulation.resolve();

    expect(simpleOutput.input).toBe(true);
    expect(simpleOutput.output).toBe(false);

    simulation.resolve();

    expect(simpleOutput.output).toBe(true);
})

test("TON in series with a simpleOutput, after two resolves, the simpleOutput input should be true", () => {
    const simulation = new Simulation(0.5)
    const network = simulation.createNetwork();
    const timerON = network.createElement(TON, { xInit: 0, xEnd: 1, yInit: 0, yEnd: 0 });
    timerON.presetTime = 1;

    const simpleOutput = network.createElement(SimpleOutput, { xInit: 1, xEnd: 2, yInit: 0, yEnd: 0 });

    simulation.play();
    simulation.resolve();

    expect(timerON.elapsedTime).toBe(0.5);
    expect(simpleOutput.input).toBe(false);

    simulation.resolve();

    expect(timerON.elapsedTime).toBe(1);
    expect(simpleOutput.input).toBe(true);
});