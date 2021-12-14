import Simulation from "./../../src/models/simulation";
import NoInput from "./../../src/models/ladder-element/inputs/no-input";
import Line from "./../../src/models/ladder-element/line/line";
import SimpleOutput from "./../../src/models/ladder-element/output/simple-output";


test("NoInput inactive, all lines should have negative input after resolve", () => {
    const simulation = new Simulation()
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

describe(`Active NoInput in series with lines and SimpleOutput at the end, 
          SimpleOutput input should be true at the first resolve and
          output should be true at the second resolve`, () => {
    const simulation = new Simulation()
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