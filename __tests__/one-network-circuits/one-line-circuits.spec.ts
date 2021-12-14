import Simulation from "./../../src/models/simulation";
import NoInput from "./../../src/models/ladder-element/inputs/no-input";
import Line from "./../../src/models/ladder-element/line/line";

describe("NoInput in series with lines", () => {
    test("NoInput inactive, all lines should have negative input after evaluation", () => {
        const simulation = new Simulation()
        const network = simulation.createNetwork();
        const noInput = network.createElement(NoInput, { xInit: 0, xEnd: 1, yInit: 0, yEnd: 0 });
        const line = network.createElement(Line, { xInit: 1, xEnd: 2, yInit: 0, yEnd: 0 });
        const line2 = network.createElement(Line, { xInit: 2, xEnd: 3, yInit: 0, yEnd: 0 });

        simulation.resolve();
    })
})
test('It should be ok', () => {
    expect("teste").toEqual("teste")
})