import Network from "../network";
import LadderCoordinates from "./ladder-coordinates";
import LadderElement from "./ladder-element";

type NewType = Network;

interface LadderElementConstructor<T extends LadderElement> {
    new (coordinates: LadderCoordinates, id: number, network: NewType): T
}

export default LadderElementConstructor