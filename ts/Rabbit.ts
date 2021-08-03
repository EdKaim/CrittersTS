/// <reference path='./CritterBase.ts' />

class Rabbit extends CritterBase {
    constructor() {
        super("Rabbit", "R", "rabbit");
    }

    takeTurn(turnParams: TurnParams): Turn {
        if (turnParams.front == TileType.Other) { return Turn.Infect; }
        if (turnParams.front == TileType.Empty) { return Turn.MoveForward; }
        return Turn.TurnRight;
    }

    clone(): Rabbit {
        return new Rabbit();
    }
}