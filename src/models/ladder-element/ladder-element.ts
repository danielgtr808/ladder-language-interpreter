import Network from "../network";
import LadderCoordinates from "./ladder-coordinates";

interface LadderElement {
    changed: boolean;
    coordinates: LadderCoordinates;
    readonly hasNoPropagationTime: boolean
    input: boolean;
    isActive: boolean;
    readonly network: Network;
    readonly output: boolean;

    resolve(): void
}

export default LadderElement