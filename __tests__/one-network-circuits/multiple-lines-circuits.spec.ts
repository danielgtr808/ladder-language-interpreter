import Simulation from "./../../src/models/simulation";
import NoInput from "./../../src/models/ladder-element/inputs/no-input";
import Line from "./../../src/models/ladder-element/line/line";
import SimpleOutput from "./../../src/models/ladder-element/output/simple-output";
import TON from "./../../src/models/ladder-element/timers/TON";
import TOF from "./../../src/models/ladder-element/timers/TOF";
import CTU from "./../../src/models/ladder-element/counters/CTU";
import NcInput from "./../../src/models/ladder-element/inputs/nc-input";
import LadderCoordinates from "../../src/models/ladder-element/ladder-coordinates";
import CTD from "./../../src/models/ladder-element/counters/CTD";

test(`Circuit with a counter connected to two noInput(one on count
    input and another on reset) connected to a simple output`, () => {
        const simulation = new Simulation(0.5);
        const network = simulation.createNetwork();

        const noInputCount = network.createElement(NoInput, new LadderCoordinates(0, 1, 0, 0));
        noInputCount.isActive = true;
        const noInputReset = network.createElement(NoInput, new LadderCoordinates(0, 1, 1, 1));
        const counterUp = network.createElement(CTU, new LadderCoordinates(1, 2, 0, 0));
        counterUp.presetValue = 2;
        const simpleOutput = network.createElement(SimpleOutput, new LadderCoordinates(2, 3, 0, 0));

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

})