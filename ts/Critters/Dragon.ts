/// <reference path='./CritterBase.ts' />

class Dragon extends CritterBase {
    getHtml = (): string => `D`;
    getCssClass = (): string => "dragon";

    turns: number = 0;

    constructor() {
        super("Dragon");
    }

    takeTurn(turnParams: TurnParams): Turn {
        if (turnParams.front == TileType.Enemy) { return Turn.Infect; }

        this.turns++;

        if ((Math.floor(this.turns / 100) % 2) == 1) {
            if (turnParams.front == TileType.Empty) { return Turn.MoveForward; }
            return Turn.TurnRight;
        }

        let west: TileType;
        let south: TileType;
        switch(turnParams.direction) {
            case Direction.North:
                west = turnParams.left;
                south = turnParams.back;
                break;
            case Direction.West:
                west = turnParams.front;
                south = turnParams.left;
                break;
            case Direction.South:
                west = turnParams.right;
                south = turnParams.front;
                break;
            case Direction.East:
                west = turnParams.back;
                south = turnParams.right;
                break;        
            }

        switch(turnParams.direction) {
            case Direction.North:
                switch (west) {
                    case TileType.Empty: 
                    case TileType.Enemy:
                        return Turn.TurnLeft;
                }
                return Turn.TurnRight;                
            case Direction.East:
                switch (south) {
                    case TileType.Empty: 
                    case TileType.Enemy:
                        return Turn.TurnRight;
                }
                return Turn.TurnLeft;                
            case Direction.West:
                switch (west) {
                    case TileType.Empty: return Turn.MoveForward;
                    case TileType.Enemy: return Turn.Infect;
                }
                switch (south) {
                    case TileType.Empty: 
                    case TileType.Enemy:
                        return Turn.TurnLeft;
                    case TileType.Same:
                    case TileType.Wall:
                        return Turn.TurnRight;
                }
            case Direction.South:
                switch (south) {
                    case TileType.Empty: return Turn.MoveForward;
                    case TileType.Enemy: return Turn.Infect;
                }
                switch (west) {
                    case TileType.Empty: 
                    case TileType.Enemy:
                        return Turn.TurnRight;
                    case TileType.Same:
                    case TileType.Wall:
                        return Turn.TurnLeft;
                }
        }
    }
}