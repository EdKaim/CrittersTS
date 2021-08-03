interface ICritter {
    name: string;
    symbol: string;

    takeTurn(turnParams: TurnParams): Turn;
    clone(): ICritter;
}