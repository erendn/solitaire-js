function Card(suit, value, deck) {
  this.suit = suit;
  this.value = value;
  this.isRevealed = false;
  this.carried = false;
  this.position = deckPosition;
  this.deck = null;
}

let deckPosition = new Vector2(1230, 50);

Card.prototype.toString = function (){
  return this.isRevealed ? this.suit + "-" + this.value : "card-back";
}