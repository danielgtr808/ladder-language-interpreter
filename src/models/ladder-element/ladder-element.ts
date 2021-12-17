import Network from "../network";
import LadderCoordinates from "./ladder-coordinates";
import LadderDimensions from "./ladder-dimensions";
import LadderElementChanges from "./ladder-element-changes";

interface LadderElement {
    address: string;
    changes: LadderElementChanges;
    coordinates: LadderCoordinates;
    readonly dimensions: LadderDimensions;
    readonly hasNoActivationTime: boolean
    readonly id: number;
    readonly input: boolean;
    isActive: boolean;
    readonly network: Network;
    readonly output: boolean;

    reset(): void
    resolve(): void
    setInput(value: boolean, segmentCoordinates: LadderCoordinates): void
}

export default LadderElement