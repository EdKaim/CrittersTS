class App {
    board: Board = new Board();
    critters: CritterInstance[] = [];
    
    gameOver: boolean = false;
    keepRunning: boolean = false;

    infectFromFrontRate: number = 50;
    infectFromSideRate: number = 75;
    infectFromBehindRate: number = 100;

    unmovedCrittersDecayTurns: number = 100;
    unmovedCrittersDecayRate: number = 0;

    critterTypes: ICritter[] = [
        new Bear(),
        new Carrot(),
        new Dragon(),
        new Mosquito(),
        new Rabbit(),
        new Tree()
    ];

    public constructor() { }

    nextTurn() {
        this.runTurn();

        if (!this.gameOver) {
            if (this.keepRunning) {
                window.setTimeout(() => this.nextTurn(), 100);
            }
        }
        else {
            window.setTimeout(() => alert("Game over!"), 100);
        }
    }

    runTurn() {
        for (let lcv = 0; lcv < this.critters.length; lcv++) {
            let critter: CritterInstance = this.critters[lcv];
            
            // Sometimes a critter gets removed if it hasn't moved in a long time.
            if (critter.turnsSinceLastMove++ > this.unmovedCrittersDecayTurns) {
                if (Utilities.randomInt(100) < this.unmovedCrittersDecayRate) {
                    this.board.remove(critter);
                    this.critters.splice(lcv--, 1);
                    console.log(`A ${critter.critter.name} was randomly removed after not moving for ${critter.turnsSinceLastMove} turns`);
                    continue;
                }
            }

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
                        critter.turnsSinceLastMove = 0;
                        if (turnParams.front == TileType.Empty) {
                            this.board.moveTo(critter, targetRow, targetColumn);
                        }
                        else {
                            // TODO: Error?
                            console.log(`Error: Tried to move forward when space was not empty`);
                        }
                    }
                    else { // Infect attempt.
                        if (turnParams.front != TileType.Enemy)
                        {
                            // TODO: Error?
                            console.log(`Error: Tried to infect something that wasn't an enemy`);
                        }
                        else
                        {                            
                            let defender: CritterInstance = this.board.getAt(targetRow, targetColumn);
                            if (!defender) { throw `No critter was at ${targetRow}, ${targetColumn}`; }
                    
                            let infectSuccessRate: number;
                    
                            switch (critter.direction) {
                                case Direction.North: infectSuccessRate = (defender.direction == Direction.North) ? this.infectFromBehindRate : (defender.direction == Direction.South) ? this.infectFromFrontRate : this.infectFromSideRate; break;
                                case Direction.East: infectSuccessRate = (defender.direction == Direction.East) ? this.infectFromBehindRate : (defender.direction == Direction.West) ? this.infectFromFrontRate : this.infectFromSideRate; break;
                                case Direction.South: infectSuccessRate = (defender.direction == Direction.South) ? this.infectFromBehindRate : (defender.direction == Direction.North) ? this.infectFromFrontRate : this.infectFromSideRate; break;
                                case Direction.West: infectSuccessRate = (defender.direction == Direction.West) ? this.infectFromBehindRate : (defender.direction == Direction.East) ? this.infectFromFrontRate : this.infectFromSideRate; break;
                                default: throw `Unexpected direction: ${critter.direction}`;
                            }
                   
                            if (Utilities.randomInt(100) < infectSuccessRate) {
                                defender.critter = critter.critter.clone();
                                this.board.moveTo(defender, defender.row, defender.column);
                            }
                            else {
                                critter.critter = defender.critter.clone();
                                this.board.moveTo(critter, critter.row, critter.column);
                            }
                        }
                    }
                    break;

                default: throw `Unexpected turn: ${turn}`;
            }

            this.updateCritterUi(critter);

            if (!this.critters.some(item => item.critter.name != critter.critter.name)) {
                this.gameOver = true;
                return;
            }
        }
    }

    updateCritterUi(critter: CritterInstance) {
        critter.htmlElement.innerHTML = critter.critter.getHtml();

        let baseCss: string = "critter";
        switch (critter.direction) {
            case Direction.North: baseCss += " facing-north"; break;
            case Direction.East: baseCss += " facing-east"; break;
            case Direction.South: baseCss += " facing-south"; break;
            default: baseCss += " facing-west"; break;
        }

        critter.htmlElement.className = `${baseCss} ${critter.critter.getCssClass()}`;

    }

    initialize() {
        this.board.initialize(<HTMLDivElement>document.getElementById("board"));

        document.getElementById("reset").onclick = () => this.reset();
        document.getElementById("run").onclick = () => this.run();
        document.getElementById("runOneTurn").onclick = () => this.nextTurn();

        (<HTMLInputElement> document.getElementById("infectFromFrontRate")).value = this.infectFromFrontRate.toString();
        (<HTMLInputElement> document.getElementById("infectFromSideRate")).value = this.infectFromSideRate.toString();
        (<HTMLInputElement> document.getElementById("infectFromBehindRate")).value = this.infectFromBehindRate.toString();

        let critterConfig: HTMLElement = document.getElementById("critterConfiguration");

        this.critterTypes.forEach((critter: ICritter) => {
            let critterDiv: HTMLElement = document.createElement("div");
            critterDiv.classList.add("input-group");
            critterDiv.classList.add("mb-3");
            critterConfig.appendChild(critterDiv);

            let critterCountInput: HTMLInputElement = <HTMLInputElement> document.createElement("input");
            critterCountInput.classList.add('form-control');
            critterCountInput.type = "number";
            critterCountInput.min = "0";
            critterCountInput.max = "100";
            critterCountInput.value = "30";
            critterCountInput.id = `${critter.name}_Count`;
            critterDiv.appendChild(critterCountInput);

            let critterCountSpan: HTMLInputElement = <HTMLInputElement> document.createElement("span");
            critterCountSpan.classList.add("input-group-text");
            critterCountSpan.innerText = `x ${critter.name}`;
            critterDiv.appendChild(critterCountSpan);
        });

        this.reset();
    }

    reset() {
        this.gameOver = false;
        this.keepRunning = false;
        this.board.reset();
        this.critters = [];

        this.infectFromFrontRate = parseInt((<HTMLInputElement> document.getElementById("infectFromFrontRate")).value);
        this.infectFromSideRate = parseInt((<HTMLInputElement> document.getElementById("infectFromSideRate")).value);
        this.infectFromBehindRate = parseInt((<HTMLInputElement> document.getElementById("infectFromBehindRate")).value);

        this.critterTypes.forEach((critter: ICritter) => {
            try {
                this.addCritters(critter);
            }
            catch (e) {
                alert(e);
                return;
            }
        });

        // Shuffle.
        for (let lcv = 0; lcv < this.critters.length; lcv++) {
            let critter = this.critters.splice(Utilities.randomInt(this.critters.length - lcv), 1)[0];
            this.critters.push(critter);
            this.updateCritterUi(critter);
        }
    }

    addCritters(critter: ICritter) {
        let count: number = 30;
        let countInput: HTMLInputElement = <HTMLInputElement> document.getElementById(`${critter.name}_Count`);
        if (countInput) {
            count = parseInt(countInput.value);
        }

        for (let lcv: number = 0; lcv < count; lcv++) {
            this.critters.push(this.board.insertRandom(critter.clone()));
        }
    }

    run() {
        this.keepRunning = !this.keepRunning;
        if (this.keepRunning) {
            this.nextTurn();
        }

        let configurationDiv: HTMLElement = document.getElementById("configuration");
        configurationDiv.hidden = this.keepRunning;
    }
}