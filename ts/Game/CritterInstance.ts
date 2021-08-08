class CritterInstance {
    public row: number;
    public column: number;
    public direction: Direction;
    public htmlElement: HTMLElement;

    constructor(public critter: ICritter) {
        this.htmlElement = document.createElement("div");
    }

    getKey(): string {
        return CritterInstance.getKey(this.row, this.column);
    }

    static getKey(row: number, column: number): string {
        return `${row}_${column}`;
    }
}