/// <reference path='./CritterBase.ts' />

class Tree extends CritterBase {
    constructor() {
        super("Tree", "T", "tree");
    }

    takeTurn(turnParams: TurnParams): Turn {
        return Turn.TurnLeft;
    }

    clone(): Tree {
        return new Tree();
    }

}