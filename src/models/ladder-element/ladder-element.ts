import Network from "../network";
import LadderCoordinates from "./ladder-coordinates";
import LadderElementChanges from "./ladder-element-changes";

interface LadderElement {
    changes: LadderElementChanges;
    coordinates: LadderCoordinates;
    readonly hasNoActivationTime: boolean
    readonly id: number;
    input: boolean;
    isActive: boolean;
    readonly network: Network;
    readonly output: boolean;

    reset(): void
    resolve(): void
}

export default LadderElement