class App {
    board: Board = new Board();
    critters: CritterInstance[] = [];
    gameOver: boolean = false;

    public constructor() { }

    nextTurn() {
        this.runTurns(this.critters.length);

        if (!this.gameOver) {
            window.setTimeout(() => this.nextTurn(), 100);
        }
        else {
            alert("Game over!");
        }
    }

    runTurns(count: number) {
        for (let lcv = 0; lcv < count; lcv++) {
            let critter: CritterInstance = this.critters.shift();
            this.critters.push(critter);

            let turnParams: TurnParams = this.board.getTurnParams(critter);
            
            let turn: Turn = critter.critter.takeTurn(turnParams);

            switch (turn) {
                case Turn.TurnRight:
                    switch(critter.direction) {
                        case Direction.North: critter.direction = Direction.East; break;
                        case Direction.East: critter.direction = Direction.South; break;
                        case Direction.South: critter.direction = Direction.West; break;
                        case Direction.West: critter.direction = Direction.North; break;
                    }
                    break;
                case Turn.TurnLeft:
                    switch(critter.direction) {
                        case Direction.North: critter.direction = Direction.West; break;
                        case Direction.East: critter.direction = Direction.North; break;
                        case Direction.South: critter.direction = Direction.East; break;
                        case Direction.West: critter.direction = Direction.South; break;
                    }
                    break;

                case Turn.Infect:
                case Turn.MoveForward:
                    let targetRow: number;
                    let targetColumn: number;

                    switch(critter.direction) {
                        case Direction.North: targetRow = critter.row - 1; targetColumn = critter.column; break;
                        case Direction.East: targetRow = critter.row; targetColumn = critter.column + 1; break;
                        case Direction.South: targetRow = critter.row + 1; targetColumn = critter.column; break;
                        case Direction.West: targetRow = critter.row; targetColumn = critter.column - 1; break;
                        throw `Unexpected direction: ${critter.direction}`;
                    }

                    if (turn == Turn.MoveForward) 
                    {
                        if (turnParams.front == TileType.Empty) {
                            this.board.moveTo(critter, targetRow, targetColumn);
                        }
                        else {
                            // TODO: Error?
                            console.log(`Error: Tried to move forward when space was not empty`);
                        }
                    }
                    else {
                        if (turnParams.front == TileType.Other)
                        {
                            this.board.tryInfect(critter, targetRow, targetColumn);
                        }
                        else {
                            // TODO: Error?
                            console.log(`Error: Tried to infect something that wasn't an enemy`);
                        }
                    }
                    break;

                default: throw `Unexpected turn: ${turn}`;
            }

            if (!this.critters.some(item => item.critter.name != critter.critter.name)) {
                this.gameOver = true;
                return;
            }
        }
    }

    run() {
        this.board.initialize();

        for (let lcv: number = 0; lcv < 30; lcv++) {
            this.critters.push(this.board.insertRandom(new Bear()));
        }

        for (let lcv: number = 0; lcv < 30; lcv++) {
            this.critters.push(this.board.insertRandom(new Tree()));
        }

        for (let lcv: number = 0; lcv < 30; lcv++) {
            this.critters.push(this.board.insertRandom(new Carrot()));
        }

        for (let lcv: number = 0; lcv < 30; lcv++) {
            this.critters.push(this.board.insertRandom(new Rabbit()));
        }

        this.nextTurn();
    }
}