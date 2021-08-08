/// <reference path='./CritterBase.ts' />

class Carrot extends CritterBase {
    getHtml = (): string => "C";
    getCssClass = (): string => "carrot";

    constructor() {
        super("Carrot");
    }

    takeTurn(turnParams: TurnParams): Turn {
        // Carrots are supposed to be easy to defeat, so they never attack and always turn away from enemies.
        if (turnParams.right == TileType.Enemy) { return Turn.TurnLeft; }
        return Turn.TurnRight;
    }

}