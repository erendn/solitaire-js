function Card(suit, rank) {
    this.suit = suit;
    this.rank = rank;
    this.revealed = true;
    this.highlighted = false;
    this.moving = false;
    this.stack = null;
    this.position = null;
}

const SUITS = {
    CLUB: 'club', SPADE: 'spade', DIAMOND: 'diamond', HEART: 'heart'
}

Card.prototype.getSpriteName = function () {
    if (this.revealed)
        return `${this.suit}-${this.rank}`;
    else
        return `card-back`;
}

Card.prototype.getColor = function () {
    return Object.keys(SUITS).indexOf(this.suit) < 2 ? COLORS.CARD.BLACK : COLORS.CARD.WHITE;
}

/**
 * Removes the instance of the object from the stack it belongs and returns that stack.
 */
Card.prototype.release = function () {
    var stack = this.stack;
    this.stack.remove(this);
    return stack;
}