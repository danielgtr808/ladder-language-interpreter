import BitAddress from "../memory-manager/bit-address";
import Network from "../network";
import LadderCoordinates from "./ladder-coordinates";
import LadderElement from "./ladder-element";

interface LadderElementConstructor<T extends LadderElement> {
    new (
        bitAddress: BitAddress,
        coordinates: LadderCoordinates,
        id: number,
        network: Network
    ): T
}

export default LadderElementConstructor