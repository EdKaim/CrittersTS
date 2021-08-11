// These are hardcoded based on CSS settings. If those classes are changed, these
// should be updated as well.
const canvasHeight: number = 500;
const canvasWidth: number = 800;
const tileHeight: number = 20;
const tileWidth: number = 20;

class Board {
    boardDiv: HTMLDivElement;

    map: { [index: string]: CritterInstance } = {};
    rows: number = Math.floor(canvasHeight / tileHeight);
    columns: number = Math.floor(canvasWidth / tileWidth);

    initialize(boardDiv: HTMLDivElement) {
        this.boardDiv = boardDiv;
    }

    reset() {
        this.map = {};
        while (this.boardDiv.firstChild) {
            this.boardDiv.removeChild(this.boardDiv.firstChild);
        }
    }

    insertRandom(critter: ICritter): CritterInstance {
        let maxCritters: number = Math.floor((this.rows * this.columns) / 4);
        if (this.boardDiv.children.length >= maxCritters) {
            throw `Cannot fill more than 25% of the board (${maxCritters} critters)`;
        }

        let row: number;
        let column: number;

        do {
            row = Utilities.randomInt(this.rows);
            column = Utilities.randomInt(this.columns);
        } while (this.getAt(row, column))

        let critterInstance: CritterInstance = new CritterInstance(critter);
        this.moveTo(critterInstance, row, column);
        this.boardDiv.appendChild(critterInstance.htmlElement);

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
            delete this.map[critterInstance.getKey()];
        }

        critterInstance.row = row;
        critterInstance.column = column;
        this.map[critterInstance.getKey()] = critterInstance;

        (<any>critterInstance.htmlElement.style)["top"] = (row * tileHeight) + "px";
        (<any>critterInstance.htmlElement.style)["left"] = (column * tileWidth) + "px";
    }

    remove(critter: CritterInstance) {
        this.boardDiv.removeChild(critter.htmlElement);
        delete this.map[CritterInstance.getKey(critter.row, critter.column)];
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
        return TileType.Enemy;
    }
}