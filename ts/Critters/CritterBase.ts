abstract class CritterBase implements ICritter {
    public constructor(public name: string) {
    }

    abstract takeTurn(turnParams: TurnParams): Turn;
    abstract getHtml(): string;
    abstract getCssClass(): string;

    clone(): ICritter {
        return new (<any>this.constructor)();
    }
}
