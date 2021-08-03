/// <reference path='./CritterBase.ts' />

class Bear extends CritterBase {
    constructor() {
        super("Bear", "B", "bear");
    }

    takeTurn(turnParams: TurnParams): Turn {
        if (turnParams.front == TileType.Other) { return Turn.Infect; }
        if (turnParams.front == TileType.Empty) { return Turn.MoveForward; }
        return Turn.TurnLeft;
    }

    clone(): Bear {
        return new Bear();
    }
}