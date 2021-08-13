/// <reference path='./CritterBase.ts' />

class Rabbit extends CritterBase {
    getHtml = (): string => `R`;
    getCssClass = (): string => "rabbit";

    constructor() {
        super("Rabbit");
    }

    takeTurn(turnParams: TurnParams): Turn {
        // Rabbits move forward until they reach an enemy. If they can't move forward, they turn right.
        if (turnParams.front == TileType.Enemy) { return Turn.Infect; }
        if (turnParams.left == TileType.Enemy) { return Turn.TurnLeft; }
        if (turnParams.right == TileType.Enemy) { return Turn.TurnRight; }
        if (turnParams.front == TileType.Empty) { return Turn.MoveForward; }
        return Turn.TurnRight;
    }
}