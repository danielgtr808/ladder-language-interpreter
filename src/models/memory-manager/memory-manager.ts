import BitAddress from "./bit-address";

class MemoryManager {

    bitAddresses: BitAddress[] = [];

    findOrCreateBitAddress(address: string): BitAddress {
        if(address == "") return new BitAddress("");

        const foundedBitAddress = this.findBitAddress(address);
        if(foundedBitAddress) return foundedBitAddress;

        const newBitAddress = new BitAddress(address);
        this.bitAddresses.push(newBitAddress);
        return newBitAddress;
    }

    findBitAddress(address: string): BitAddress | undefined {
        return this.bitAddresses.find(x => x.address == address);
    }

}

export default MemoryManager