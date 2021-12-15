// import Network from "../../network";
// import LadderCoordinates from "../ladder-coordinates";
// import LadderElement from "../ladder-element";
// import LadderElementChanges from "../ladder-element-changes";
// import LadderCounter from "./ladder-counter";

// class CounterReset implements LadderElement {

//     changes: LadderElementChanges = { input: false, internalState: false, output: false };
//     counter: LadderCounter | undefined;
//     readonly hasNoActivationTime: boolean = false; 
//     readonly output: boolean = false;

//     private _input: boolean = false;

//     constructor(public readonly coordinates: LadderCoordinates, public readonly id: number, public readonly network: Network) { }

//     get input(): boolean {
//         return this._input;
//     }

//     set input(value: boolean) {
//         this._input = value;
//         if(!value || !this.counter) return;
//         this.counter.resetTimer();
//     }

//     get isActive(): boolean {
//         return false;
//     }

//     set isActive(value: boolean) { }

//     reset(): void {
//         this._input = false;
//     }

//     resolve(): void { }

// }

// export default CounterReset