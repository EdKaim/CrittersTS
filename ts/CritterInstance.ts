class CritterInstance {
    public row: number;
    public column: number;
    public direction: Direction;

    constructor(public critter: CritterBase) {
    }

    getKey(): string {
        return CritterInstance.getKey(this.row, this.column);
    }

    static getKey(row: number, column: number): string {
        return `${row}_${column}`;
    }
}