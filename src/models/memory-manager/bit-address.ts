type stateChangedCallback = (state: boolean) => void

class BitAddress {

    private _subscribers: stateChangedCallback[] = [];
    private _state: boolean = false;

    constructor(public readonly address: string) { }

    get state(): boolean {
        return this._state;
    }

    set state(value: boolean) {
        if(this.state == value) return;
        this._state = value;
        this._subscribers.forEach(x => x(this.state));
    }

    subscribe(calllback: stateChangedCallback) {
        this._subscribers.push(calllback)
    }

    unsubscribe(callback: stateChangedCallback) {
        const elementToRemoveIndex = this._subscribers.findIndex(x => x == callback);
        if(elementToRemoveIndex == -1) return;

        this._subscribers.splice(elementToRemoveIndex, 1);
    }

}

export default BitAddress