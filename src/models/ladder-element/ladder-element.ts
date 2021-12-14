import Network from "../network";
import LadderCoordinates from "./ladder-coordinates";

interface LadderElement {
    coordinates: LadderCoordinates;
    input: boolean;
    isActive: boolean;
    readonly network: Network;
    readonly output: boolean;
}

export default LadderElement