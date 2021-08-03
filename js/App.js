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
    }
    App.prototype.nextTurn = function () {
        var _this = this;
        this.runTurns(this.critters.length);
        if (!this.gameOver) {
            window.setTimeout(function () { return _this.nextTurn(); }, 100);
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
                    else {
                        if (turnParams.front == TileType.Other) {
                            this_1.board.tryInfect(critter, targetRow, targetColumn);
                        }
                        else {
                            // TODO: Error?
                            console.log("Error: Tried to infect something that wasn't an enemy");
                        }
                    }
                    break;
                default: throw "Unexpected turn: " + turn;
            }
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
    App.prototype.run = function () {
        this.board.initialize();
        for (var lcv = 0; lcv < 30; lcv++) {
            this.critters.push(this.board.insertRandom(new Bear()));
        }
        for (var lcv = 0; lcv < 30; lcv++) {
            this.critters.push(this.board.insertRandom(new Tree()));
        }
        for (var lcv = 0; lcv < 30; lcv++) {
            this.critters.push(this.board.insertRandom(new Carrot()));
        }
        for (var lcv = 0; lcv < 30; lcv++) {
            this.critters.push(this.board.insertRandom(new Rabbit()));
        }
        this.nextTurn();
    };
    return App;
}());
var CritterBase = /** @class */ (function () {
    function CritterBase(name, symbol, className) {
        this.name = name;
        this.symbol = symbol;
        this.className = className;
        this.div = document.createElement("div");
        this.div.className = "critter " + className;
        this.div.innerHTML = symbol;
    }
    return CritterBase;
}());
/// <reference path='./CritterBase.ts' />
var Bear = /** @class */ (function (_super) {
    __extends(Bear, _super);
    function Bear() {
        return _super.call(this, "Bear", "B", "bear") || this;
    }
    Bear.prototype.takeTurn = function (turnParams) {
        if (turnParams.front == TileType.Other) {
            return Turn.Infect;
        }
        if (turnParams.front == TileType.Empty) {
            return Turn.MoveForward;
        }
        return Turn.TurnLeft;
    };
    Bear.prototype.clone = function () {
        return new Bear();
    };
    return Bear;
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
    Board.prototype.initialize = function () {
        this.canvas = document.getElementById("canvas");
    };
    Board.prototype.insertRandom = function (critter) {
        var row;
        var column;
        do {
            row = Utilities.randomInt(this.rows);
            column = Utilities.randomInt(this.columns);
        } while (this.getAt(row, column));
        var critterInstance = new CritterInstance(critter);
        this.moveTo(critterInstance, row, column);
        this.canvas.appendChild(critterInstance.critter.div);
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
            this.map[critterInstance.getKey()] = null;
        }
        critterInstance.row = row;
        critterInstance.column = column;
        this.map[critterInstance.getKey()] = critterInstance;
        critterInstance.critter.div.style["top"] = (row * tileHeight) + "px";
        critterInstance.critter.div.style["left"] = (column * tileWidth) + "px";
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
        return TileType.Other;
    };
    Board.prototype.tryInfect = function (attacker, row, column) {
        var defender = this.getAt(row, column);
        if (!defender) {
            throw "No critter was at " + row + ", " + column;
        }
        var odds;
        switch (attacker.direction) {
            case Direction.North:
                odds = (defender.direction == Direction.North) ? 0 : (defender.direction == Direction.South) ? 2 : 3;
                break;
            case Direction.East:
                odds = (defender.direction == Direction.East) ? 0 : (defender.direction == Direction.West) ? 2 : 3;
                break;
            case Direction.South:
                odds = (defender.direction == Direction.South) ? 0 : (defender.direction == Direction.North) ? 2 : 3;
                break;
            case Direction.West:
                odds = (defender.direction == Direction.West) ? 0 : (defender.direction == Direction.East) ? 2 : 3;
                break;
            default: throw "Unexpected direction: " + attacker.direction;
        }
        var winner;
        var loser;
        if (odds == 0) {
            winner = attacker;
            loser = defender;
        }
        else {
            if (Utilities.randomInt(odds) == 0) {
                winner = defender;
                loser = attacker;
            }
            else {
                winner = attacker;
                loser = defender;
            }
        }
        this.canvas.removeChild(loser.critter.div);
        loser.critter = winner.critter.clone();
        this.moveTo(loser, loser.row, loser.column);
        this.canvas.appendChild(loser.critter.div);
    };
    return Board;
}());
/// <reference path='./CritterBase.ts' />
var Carrot = /** @class */ (function (_super) {
    __extends(Carrot, _super);
    function Carrot() {
        return _super.call(this, "Carrot", "C", "carrot") || this;
    }
    Carrot.prototype.takeTurn = function (turnParams) {
        return Turn.TurnRight;
    };
    Carrot.prototype.clone = function () {
        return new Carrot();
    };
    return Carrot;
}(CritterBase));
var CritterInstance = /** @class */ (function () {
    function CritterInstance(critter) {
        this.critter = critter;
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
/// <reference path='./CritterBase.ts' />
var Rabbit = /** @class */ (function (_super) {
    __extends(Rabbit, _super);
    function Rabbit() {
        return _super.call(this, "Rabbit", "R", "rabbit") || this;
    }
    Rabbit.prototype.takeTurn = function (turnParams) {
        if (turnParams.front == TileType.Other) {
            return Turn.Infect;
        }
        if (turnParams.front == TileType.Empty) {
            return Turn.MoveForward;
        }
        return Turn.TurnRight;
    };
    Rabbit.prototype.clone = function () {
        return new Rabbit();
    };
    return Rabbit;
}(CritterBase));
var TileType;
(function (TileType) {
    TileType[TileType["Empty"] = 0] = "Empty";
    TileType[TileType["Wall"] = 1] = "Wall";
    TileType[TileType["Same"] = 2] = "Same";
    TileType[TileType["Other"] = 3] = "Other";
})(TileType || (TileType = {}));
/// <reference path='./CritterBase.ts' />
var Tree = /** @class */ (function (_super) {
    __extends(Tree, _super);
    function Tree() {
        return _super.call(this, "Tree", "T", "tree") || this;
    }
    Tree.prototype.takeTurn = function (turnParams) {
        return Turn.TurnLeft;
    };
    Tree.prototype.clone = function () {
        return new Tree();
    };
    return Tree;
}(CritterBase));
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
var Utilities = /** @class */ (function () {
    function Utilities() {
    }
    Utilities.randomInt = function (exclusiveMax) {
        return Math.floor(Math.random() * exclusiveMax);
    };
    return Utilities;
}());
//# sourceMappingURL=App.js.map