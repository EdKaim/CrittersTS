abstract class CritterBase implements ICritter {
    div: HTMLDivElement;

    public constructor(public name: string, public symbol: string, public className: string) {
        this.div = document.createElement("div");
        this.div.className = `critter ${className}`;
        this.div.innerHTML = symbol;
    }

    abstract takeTurn(turnParams: TurnParams): Turn;

    abstract clone(): CritterBase;
}
