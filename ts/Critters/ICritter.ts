interface ICritter {
    name: string;

    // Determines what a critter does on its turn.
    takeTurn(turnParams: TurnParams): Turn;

    // Returns the CSS class [list] to apply to the element after its most recent turn.
    getCssClass(): string;

    // Returns the HTML to display to the element after its most recent turn.
    getHtml(): string;

    // Returns a new instance of the critter type. This is used when a critter is infected
    // and "switches" type.
    clone(): ICritter;
}