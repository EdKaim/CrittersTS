/// <reference path='./CritterBase.ts' />

class Carrot extends CritterBase {
    constructor() {
        super("Carrot", "C", "carrot");
    }

    takeTurn(turnParams: TurnParams): Turn {
        return Turn.TurnRight;
    }

    clone(): Carrot {
        return new Carrot();
    }

}