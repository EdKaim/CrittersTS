/// <reference path='./CritterBase.ts' />

class Tree extends CritterBase {
    getHtml = (): string => `<i class="bi bi-tree-fill"></i>`;
    getCssClass = (): string => "tree";

    constructor() {
        super("Tree");
    }

    takeTurn(turnParams: TurnParams): Turn {
        // Trees don't move, but they do try to position themselves for the best defense.
        if (turnParams.front == TileType.Enemy) { return Turn.Infect; }
        if (turnParams.right == TileType.Enemy) { return Turn.TurnRight; }
        return Turn.TurnLeft;
    }
}