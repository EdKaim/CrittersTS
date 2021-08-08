/// <reference path='./CritterBase.ts' />

class Bear extends CritterBase {
    getHtml = (): string => "B";
    getCssClass = (): string => "bear";

    constructor() {
        super("Bear");
    }

    takeTurn(turnParams: TurnParams): Turn {
        // Bears move forward until they reach an enemy. If they can't move forward, they turn left.
        if (turnParams.front == TileType.Enemy) { return Turn.Infect; }
        if (turnParams.front == TileType.Empty) { return Turn.MoveForward; }
        return Turn.TurnLeft;
    }
}