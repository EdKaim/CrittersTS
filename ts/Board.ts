const canvasHeight: number = 500;
const canvasWidth: number = 1000;
const tileHeight: number = 20;
const tileWidth: number = 20;

class Board {
    canvas: HTMLDivElement;

    map: { [index: string]: CritterInstance } = {};
    rows: number = Math.floor(canvasHeight / tileHeight);
    columns: number = Math.floor(canvasWidth / tileWidth);

    initialize() {
        this.canvas = <HTMLDivElement> document.getElementById("canvas");
    }

    insertRandom(critter: CritterBase): CritterInstance {
        let row: number;
        let column: number;

        do {
            row = Utilities.randomInt(this.rows);
            column = Utilities.randomInt(this.columns);
        } while (this.getAt(row, column))

        let critterInstance: CritterInstance = new CritterInstance(critter);
        this.moveTo(critterInstance, row, column);
        this.canvas.appendChild(critterInstance.critter.div);

        switch(Utilities.randomInt(4)) {
            case 0: critterInstance.direction = Direction.North; break;
            case 1: critterInstance.direction = Direction.East; break;
            case 2: critterInstance.direction = Direction.South; break;
            case 3: critterInstance.direction = Direction.West; break;
            default: throw "Unexpected random value in direction selection";
        }

        return critterInstance;
    }

    getAt(row: number, column: number): CritterInstance {
        return this.map[CritterInstance.getKey(row, column)];
    }

    moveTo(critterInstance: CritterInstance, row: number, column: number) {
        if (this.map[critterInstance.getKey()] == critterInstance) {
            this.map[critterInstance.getKey()] = null;
        }

        critterInstance.row = row;
        critterInstance.column = column;
        this.map[critterInstance.getKey()] = critterInstance;

        (<any>critterInstance.critter.div.style)["top"] = (row * tileHeight) + "px";
        (<any>critterInstance.critter.div.style)["left"] = (column * tileWidth) + "px";
    }
    
    getTurnParams(critter: CritterInstance): TurnParams {
        let turnParams: TurnParams = new TurnParams();
        turnParams.direction = critter.direction;
        
        let tiles: [number, number][] = [
            [critter.row - 1, critter.column],
            [critter.row, critter.column + 1],
            [critter.row + 1, critter.column],
            [critter.row, critter.column - 1],
        ];

        let offset: number = 0;
        switch(critter.direction) {
            case Direction.North: offset = 0; break;
            case Direction.East: offset = 1; break;
            case Direction.South: offset = 2; break;
            case Direction.West: offset = 3; break;
            throw `Unexpected direction ${critter.direction}`;
        }
        
        turnParams.front = this.getTileType(tiles[offset][0], tiles[offset][1], critter.critter.name);
        turnParams.right = this.getTileType(tiles[(offset + 1) % 4][0], tiles[(offset + 1) % 4][1], critter.critter.name);
        turnParams.back = this.getTileType(tiles[(offset + 2) % 4][0], tiles[(offset + 2) % 4][1], critter.critter.name);
        turnParams.left = this.getTileType(tiles[(offset + 3) % 4][0], tiles[(offset + 3) % 4][1], critter.critter.name);

        return turnParams;
    }

    getTileType(row: number, column: number, name: string): TileType {
        if ((row < 0) || (row >= this.rows) || (column < 0) || (column >= this.columns)) { return TileType.Wall; }

        let critter: CritterInstance = this.getAt(row, column);
        if (!critter) { return TileType.Empty; }
        if (critter.critter.name == name) { return TileType.Same; }
        return TileType.Other;
    }

    tryInfect(attacker: CritterInstance, row: number, column: number) {
        let defender: CritterInstance = this.getAt(row, column);
        if (!defender) { throw `No critter was at ${row}, ${column}`; }

        let odds: number;

        switch (attacker.direction) {
            case Direction.North: odds = (defender.direction == Direction.North) ? 0 : (defender.direction == Direction.South) ? 2 : 3; break;
            case Direction.East: odds = (defender.direction == Direction.East) ? 0 : (defender.direction == Direction.West) ? 2 : 3; break;
            case Direction.South: odds = (defender.direction == Direction.South) ? 0 : (defender.direction == Direction.North) ? 2 : 3; break;
            case Direction.West: odds = (defender.direction == Direction.West) ? 0 : (defender.direction == Direction.East) ? 2 : 3; break;
            default: throw `Unexpected direction: ${attacker.direction}`;
        }

        let winner: CritterInstance;
        let loser: CritterInstance;

        if (odds == 0) {
            winner = attacker;
            loser = defender;
        }
        else {
            if (Utilities.randomInt(odds) == 0) {
                winner = defender;
                loser = attacker;
            }
            else
            {
                winner = attacker;
                loser = defender;
            }
        }

        this.canvas.removeChild(loser.critter.div);
        loser.critter = winner.critter.clone();
        this.moveTo(loser, loser.row, loser.column);
        this.canvas.appendChild(loser.critter.div);
    }
}