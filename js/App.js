var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var App = /** @class */ (function () {
    function App() {
        this.board = new Board();
        this.critters = [];
        this.gameOver = false;
        this.keepRunning = false;
        this.infectFromFrontRate = 50;
        this.infectFromSideRate = 75;
        this.infectFromBehindRate = 100;
    }
    App.prototype.nextTurn = function () {
        var _this = this;
        this.runTurns(this.critters.length);
        if (!this.gameOver) {
            if (this.keepRunning) {
                window.setTimeout(function () { return _this.nextTurn(); }, 100);
            }
        }
        else {
            alert("Game over!");
        }
    };
    App.prototype.runTurns = function (count) {
        var _loop_1 = function (lcv) {
            var critter = this_1.critters.shift();
            this_1.critters.push(critter);
            var turnParams = this_1.board.getTurnParams(critter);
            var turn = critter.critter.takeTurn(turnParams);
            switch (turn) {
                case Turn.TurnRight:
                    switch (critter.direction) {
                        case Direction.North:
                            critter.direction = Direction.East;
                            break;
                        case Direction.East:
                            critter.direction = Direction.South;
                            break;
                        case Direction.South:
                            critter.direction = Direction.West;
                            break;
                        case Direction.West:
                            critter.direction = Direction.North;
                            break;
                    }
                    break;
                case Turn.TurnLeft:
                    switch (critter.direction) {
                        case Direction.North:
                            critter.direction = Direction.West;
                            break;
                        case Direction.East:
                            critter.direction = Direction.North;
                            break;
                        case Direction.South:
                            critter.direction = Direction.East;
                            break;
                        case Direction.West:
                            critter.direction = Direction.South;
                            break;
                    }
                    break;
                case Turn.Infect:
                case Turn.MoveForward:
                    var targetRow = void 0;
                    var targetColumn = void 0;
                    switch (critter.direction) {
                        case Direction.North:
                            targetRow = critter.row - 1;
                            targetColumn = critter.column;
                            break;
                        case Direction.East:
                            targetRow = critter.row;
                            targetColumn = critter.column + 1;
                            break;
                        case Direction.South:
                            targetRow = critter.row + 1;
                            targetColumn = critter.column;
                            break;
                        case Direction.West:
                            targetRow = critter.row;
                            targetColumn = critter.column - 1;
                            break;
                            throw "Unexpected direction: " + critter.direction;
                    }
                    if (turn == Turn.MoveForward) {
                        if (turnParams.front == TileType.Empty) {
                            this_1.board.moveTo(critter, targetRow, targetColumn);
                        }
                        else {
                            // TODO: Error?
                            console.log("Error: Tried to move forward when space was not empty");
                        }
                    }
                    else { // Infect attempt.
                        if (turnParams.front != TileType.Enemy) {
                            // TODO: Error?
                            console.log("Error: Tried to infect something that wasn't an enemy");
                        }
                        else {
                            var defender = this_1.board.getAt(targetRow, targetColumn);
                            if (!defender) {
                                throw "No critter was at " + targetRow + ", " + targetColumn;
                            }
                            var infectSuccessRate = void 0;
                            switch (critter.direction) {
                                case Direction.North:
                                    infectSuccessRate = (defender.direction == Direction.North) ? this_1.infectFromBehindRate : (defender.direction == Direction.South) ? this_1.infectFromFrontRate : this_1.infectFromSideRate;
                                    break;
                                case Direction.East:
                                    infectSuccessRate = (defender.direction == Direction.East) ? this_1.infectFromBehindRate : (defender.direction == Direction.West) ? this_1.infectFromFrontRate : this_1.infectFromSideRate;
                                    break;
                                case Direction.South:
                                    infectSuccessRate = (defender.direction == Direction.South) ? this_1.infectFromBehindRate : (defender.direction == Direction.North) ? this_1.infectFromFrontRate : this_1.infectFromSideRate;
                                    break;
                                case Direction.West:
                                    infectSuccessRate = (defender.direction == Direction.West) ? this_1.infectFromBehindRate : (defender.direction == Direction.East) ? this_1.infectFromFrontRate : this_1.infectFromSideRate;
                                    break;
                                default: throw "Unexpected direction: " + critter.direction;
                            }
                            if (Utilities.randomInt(100) < infectSuccessRate) {
                                defender.critter = critter.critter.clone();
                                this_1.board.moveTo(defender, defender.row, defender.column);
                            }
                            else {
                                critter.critter = defender.critter.clone();
                                this_1.board.moveTo(critter, critter.row, critter.column);
                            }
                        }
                    }
                    break;
                default: throw "Unexpected turn: " + turn;
            }
            this_1.updateCritterUi(critter);
            if (!this_1.critters.some(function (item) { return item.critter.name != critter.critter.name; })) {
                this_1.gameOver = true;
                return { value: void 0 };
            }
        };
        var this_1 = this;
        for (var lcv = 0; lcv < count; lcv++) {
            var state_1 = _loop_1(lcv);
            if (typeof state_1 === "object")
                return state_1.value;
        }
    };
    App.prototype.updateCritterUi = function (critter) {
        critter.htmlElement.innerHTML = critter.critter.getHtml();
        var baseCss = "critter";
        switch (critter.direction) {
            case Direction.North:
                baseCss += " facing-north";
                break;
            case Direction.East:
                baseCss += " facing-east";
                break;
            case Direction.South:
                baseCss += " facing-south";
                break;
            default:
                baseCss += " facing-west";
                break;
        }
        critter.htmlElement.className = baseCss + " " + critter.critter.getCssClass();
    };
    App.prototype.initialize = function () {
        var _this = this;
        this.board.initialize(document.getElementById("board"));
        document.getElementById("reset").onclick = function () { return _this.reset(); };
        document.getElementById("run").onclick = function () { return _this.run(); };
        document.getElementById("infectFromFrontRate").value = this.infectFromFrontRate.toString();
        document.getElementById("infectFromSideRate").value = this.infectFromSideRate.toString();
        document.getElementById("infectFromBehindRate").value = this.infectFromBehindRate.toString();
        this.reset();
    };
    App.prototype.reset = function () {
        this.gameOver = false;
        this.keepRunning = false;
        this.board.reset();
        this.critters = [];
        this.infectFromFrontRate = parseInt(document.getElementById("infectFromFrontRate").value);
        this.infectFromSideRate = parseInt(document.getElementById("infectFromSideRate").value);
        this.infectFromBehindRate = parseInt(document.getElementById("infectFromBehindRate").value);
        try {
            this.addCritters(new Bear(), "bearCount");
            this.addCritters(new Tree(), "treeCount");
            this.addCritters(new Rabbit(), "rabbitCount");
            this.addCritters(new Carrot(), "carrotCount");
        }
        catch (e) {
            alert(e);
            return;
        }
        // Shuffle.
        for (var lcv = 0; lcv < this.critters.length; lcv++) {
            var critter = this.critters.splice(Utilities.randomInt(this.critters.length - lcv), 1)[0];
            this.critters.push(critter);
            this.updateCritterUi(critter);
        }
    };
    App.prototype.addCritters = function (critter, countInputName) {
        var count = 30;
        var countInput = document.getElementById(countInputName);
        if (countInput) {
            count = parseInt(countInput.value);
        }
        for (var lcv = 0; lcv < count; lcv++) {
            this.critters.push(this.board.insertRandom(critter.clone()));
        }
    };
    App.prototype.run = function () {
        this.keepRunning = !this.keepRunning;
        if (this.keepRunning) {
            this.nextTurn();
        }
        var configurationDiv = document.getElementById("configuration");
        configurationDiv.hidden = this.keepRunning;
    };
    return App;
}());
var Utilities = /** @class */ (function () {
    function Utilities() {
    }
    Utilities.randomInt = function (exclusiveMax) {
        return Math.floor(Math.random() * exclusiveMax);
    };
    return Utilities;
}());
var CritterBase = /** @class */ (function () {
    function CritterBase(name) {
        this.name = name;
    }
    CritterBase.prototype.clone = function () {
        return new this.constructor();
    };
    return CritterBase;
}());
/// <reference path='./CritterBase.ts' />
var Bear = /** @class */ (function (_super) {
    __extends(Bear, _super);
    function Bear() {
        var _this = _super.call(this, "Bear") || this;
        _this.getHtml = function () { return "B"; };
        _this.getCssClass = function () { return "bear"; };
        return _this;
    }
    Bear.prototype.takeTurn = function (turnParams) {
        // Bears move forward until they reach an enemy. If they can't move forward, they turn left.
        if (turnParams.front == TileType.Enemy) {
            return Turn.Infect;
        }
        if (turnParams.front == TileType.Empty) {
            return Turn.MoveForward;
        }
        return Turn.TurnLeft;
    };
    return Bear;
}(CritterBase));
/// <reference path='./CritterBase.ts' />
var Carrot = /** @class */ (function (_super) {
    __extends(Carrot, _super);
    function Carrot() {
        var _this = _super.call(this, "Carrot") || this;
        _this.getHtml = function () { return "C"; };
        _this.getCssClass = function () { return "carrot"; };
        return _this;
    }
    Carrot.prototype.takeTurn = function (turnParams) {
        // Carrots are supposed to be easy to defeat, so they never attack and always turn away from enemies.
        if (turnParams.right == TileType.Enemy) {
            return Turn.TurnLeft;
        }
        return Turn.TurnRight;
    };
    return Carrot;
}(CritterBase));
/// <reference path='./CritterBase.ts' />
var Rabbit = /** @class */ (function (_super) {
    __extends(Rabbit, _super);
    function Rabbit() {
        var _this = _super.call(this, "Rabbit") || this;
        _this.getHtml = function () { return "R"; };
        _this.getCssClass = function () { return "rabbit"; };
        return _this;
    }
    Rabbit.prototype.takeTurn = function (turnParams) {
        // Rabbits move forward until they reach an enemy. If they can't move forward, they turn right.
        if (turnParams.front == TileType.Enemy) {
            return Turn.Infect;
        }
        if (turnParams.front == TileType.Empty) {
            return Turn.MoveForward;
        }
        return Turn.TurnRight;
    };
    return Rabbit;
}(CritterBase));
/// <reference path='./CritterBase.ts' />
var Tree = /** @class */ (function (_super) {
    __extends(Tree, _super);
    function Tree() {
        var _this = _super.call(this, "Tree") || this;
        _this.getHtml = function () { return "T"; };
        _this.getCssClass = function () { return "tree"; };
        return _this;
    }
    Tree.prototype.takeTurn = function (turnParams) {
        // Trees don't move, but they do try to position themselves for the best defense.
        if (turnParams.front == TileType.Enemy) {
            return Turn.Infect;
        }
        if (turnParams.right == TileType.Enemy) {
            return Turn.TurnRight;
        }
        return Turn.TurnLeft;
    };
    return Tree;
}(CritterBase));
var canvasHeight = 500;
var canvasWidth = 1000;
var tileHeight = 20;
var tileWidth = 20;
var Board = /** @class */ (function () {
    function Board() {
        this.map = {};
        this.rows = Math.floor(canvasHeight / tileHeight);
        this.columns = Math.floor(canvasWidth / tileWidth);
    }
    Board.prototype.initialize = function (boardDiv) {
        this.boardDiv = boardDiv;
    };
    Board.prototype.reset = function () {
        this.map = {};
        while (this.boardDiv.firstChild) {
            this.boardDiv.removeChild(this.boardDiv.firstChild);
        }
    };
    Board.prototype.insertRandom = function (critter) {
        var maxCritters = Math.floor((this.rows * this.columns) / 4);
        if (this.boardDiv.children.length >= maxCritters) {
            throw "Cannot fill more than 25% of the board (" + maxCritters + " critters)";
        }
        var row;
        var column;
        do {
            row = Utilities.randomInt(this.rows);
            column = Utilities.randomInt(this.columns);
        } while (this.getAt(row, column));
        var critterInstance = new CritterInstance(critter);
        this.moveTo(critterInstance, row, column);
        this.boardDiv.appendChild(critterInstance.htmlElement);
        switch (Utilities.randomInt(4)) {
            case 0:
                critterInstance.direction = Direction.North;
                break;
            case 1:
                critterInstance.direction = Direction.East;
                break;
            case 2:
                critterInstance.direction = Direction.South;
                break;
            case 3:
                critterInstance.direction = Direction.West;
                break;
            default: throw "Unexpected random value in direction selection";
        }
        return critterInstance;
    };
    Board.prototype.getAt = function (row, column) {
        return this.map[CritterInstance.getKey(row, column)];
    };
    Board.prototype.moveTo = function (critterInstance, row, column) {
        if (this.map[critterInstance.getKey()] == critterInstance) {
            delete this.map[critterInstance.getKey()];
        }
        critterInstance.row = row;
        critterInstance.column = column;
        this.map[critterInstance.getKey()] = critterInstance;
        critterInstance.htmlElement.style["top"] = (row * tileHeight) + "px";
        critterInstance.htmlElement.style["left"] = (column * tileWidth) + "px";
    };
    Board.prototype.getTurnParams = function (critter) {
        var turnParams = new TurnParams();
        turnParams.direction = critter.direction;
        var tiles = [
            [critter.row - 1, critter.column],
            [critter.row, critter.column + 1],
            [critter.row + 1, critter.column],
            [critter.row, critter.column - 1],
        ];
        var offset = 0;
        switch (critter.direction) {
            case Direction.North:
                offset = 0;
                break;
            case Direction.East:
                offset = 1;
                break;
            case Direction.South:
                offset = 2;
                break;
            case Direction.West:
                offset = 3;
                break;
                throw "Unexpected direction " + critter.direction;
        }
        turnParams.front = this.getTileType(tiles[offset][0], tiles[offset][1], critter.critter.name);
        turnParams.right = this.getTileType(tiles[(offset + 1) % 4][0], tiles[(offset + 1) % 4][1], critter.critter.name);
        turnParams.back = this.getTileType(tiles[(offset + 2) % 4][0], tiles[(offset + 2) % 4][1], critter.critter.name);
        turnParams.left = this.getTileType(tiles[(offset + 3) % 4][0], tiles[(offset + 3) % 4][1], critter.critter.name);
        return turnParams;
    };
    Board.prototype.getTileType = function (row, column, name) {
        if ((row < 0) || (row >= this.rows) || (column < 0) || (column >= this.columns)) {
            return TileType.Wall;
        }
        var critter = this.getAt(row, column);
        if (!critter) {
            return TileType.Empty;
        }
        if (critter.critter.name == name) {
            return TileType.Same;
        }
        return TileType.Enemy;
    };
    return Board;
}());
var CritterInstance = /** @class */ (function () {
    function CritterInstance(critter) {
        this.critter = critter;
        this.htmlElement = document.createElement("div");
    }
    CritterInstance.prototype.getKey = function () {
        return CritterInstance.getKey(this.row, this.column);
    };
    CritterInstance.getKey = function (row, column) {
        return row + "_" + column;
    };
    return CritterInstance;
}());
var Direction;
(function (Direction) {
    Direction[Direction["North"] = 0] = "North";
    Direction[Direction["East"] = 1] = "East";
    Direction[Direction["South"] = 2] = "South";
    Direction[Direction["West"] = 3] = "West";
})(Direction || (Direction = {}));
var TileType;
(function (TileType) {
    TileType[TileType["Empty"] = 0] = "Empty";
    TileType[TileType["Wall"] = 1] = "Wall";
    TileType[TileType["Same"] = 2] = "Same";
    TileType[TileType["Enemy"] = 3] = "Enemy";
})(TileType || (TileType = {}));
var Turn;
(function (Turn) {
    Turn[Turn["Infect"] = 0] = "Infect";
    Turn[Turn["MoveForward"] = 1] = "MoveForward";
    Turn[Turn["TurnRight"] = 2] = "TurnRight";
    Turn[Turn["TurnLeft"] = 3] = "TurnLeft";
})(Turn || (Turn = {}));
var TurnParams = /** @class */ (function () {
    function TurnParams() {
    }
    return TurnParams;
}());
//# sourceMappingURL=App.js.map