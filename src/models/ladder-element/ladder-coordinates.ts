class LadderCoordinates {
    constructor(
        public xInit: number,
        public xEnd: number,
        public yInit: number,
        public yEnd: number
    ) { }

    areEqual(otherCoordinate: LadderCoordinates): boolean {
        return this.xInit == otherCoordinate.xInit &&
            this.yInit == otherCoordinate.yInit &&
            this.xEnd == otherCoordinate.xEnd &&
            this.yEnd == otherCoordinate.yEnd
    }

    incrementX(value: number): LadderCoordinates {
        return new LadderCoordinates(
            this.xInit + value,
            this.xEnd + value,
            this.yInit,
            this.yEnd
        );
    }

    incrementY(value: number): LadderCoordinates {
        return new LadderCoordinates(
            this.xInit,
            this.xEnd,
            this.yInit + value,
            this.yEnd + value
        );
    }

    isNextCoordinate(otherCoordinate: LadderCoordinates): boolean {        
        return this.xInit == otherCoordinate.xEnd && (
            this.yInit == otherCoordinate.yEnd ||
            this.yEnd == otherCoordinate.yInit ||
            this.yInit == otherCoordinate.yInit
        );
    }

    isPreviousCoordinate(otherCoordinate: LadderCoordinates): boolean {
        return this.xInit == otherCoordinate.xEnd && (
            this.yEnd == otherCoordinate.yEnd ||
            this.yInit == otherCoordinate.yEnd ||
            this.yInit == otherCoordinate.yInit
        );
    }
}

export default LadderCoordinates