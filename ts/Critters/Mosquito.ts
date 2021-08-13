/// <reference path='./CritterBase.ts' />

class Mosquito extends CritterBase {
    getHtml = (): string => `<i class="bi bi-twitter"></i>`;
    getCssClass = (): string => "mosquito";

    constructor() {
        super("Mosquito");
    }

    takeTurn(turnParams: TurnParams): Turn {
        if (turnParams.front == TileType.Enemy) { return Turn.Infect; }
        if (turnParams.left == TileType.Enemy) { return Turn.TurnLeft; }
        if (turnParams.right == TileType.Enemy) { return Turn.TurnRight; }

        // Mosquitos move forward 2/3 of the time, otherwise they randomly move right or left.
        if (turnParams.front == TileType.Empty) {
            if (Utilities.randomInt(3) != 0) { return Turn.MoveForward; }
        }

        if (Utilities.randomInt(2) == 0) { return Turn.TurnRight; }

        return Turn.TurnLeft;
    }
}