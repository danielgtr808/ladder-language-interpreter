import Network from "../network";
import LadderCoordinates from "./ladder-coordinates";

interface LadderElement {
    changed: boolean;
    coordinates: LadderCoordinates;
    readonly hasNoPropagationTime: boolean
    readonly id: number;
    input: boolean;
    isActive: boolean;
    readonly network: Network;
    readonly output: boolean;

    reset(): void
    resolve(): void
}

export default LadderElement