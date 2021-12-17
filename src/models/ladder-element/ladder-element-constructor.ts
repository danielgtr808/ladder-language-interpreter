import BitAddress from "../memory-manager/bit-address";
import Network from "../network";
import LadderCoordinates from "./ladder-coordinates";
import LadderElement from "./ladder-element";

type NewType = Network;

interface LadderElementConstructor<T extends LadderElement> {
    new (
        bitAddress: BitAddress,
        coordinates: LadderCoordinates,
        id: number,
        network: NewType
    ): T
}

export default LadderElementConstructor