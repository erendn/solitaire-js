function GameWorld() {
  this.deck = new Stack(new Vector2(1230, 50));
  this.pile = new Stack(new Vector2(1400, 50));
  this.club = new Stack(clubPosition);
  this.diamond = new Stack(diamondPosition);
  this.spade = new Stack(spadePosition);
  this.heart = new Stack(heartPosition);
  this.grounds = [];
  this.pressed = [];
  for (i = 1; i < 14; i++) {
    this.deck.push(new Card('club', i, this.deck));
    this.deck.push(new Card('diamond', i, this.deck));
    this.deck.push(new Card('spade', i, this.deck));
    this.deck.push(new Card('heart', i, this.deck));
  }
  this.deck.shuffle();
  for (i = 0; i < 7; i++) {
    this.grounds.push(new Ground(new Vector2(380 + i * 170, 300)));
    for (j = 0; j <= i; j++) {
      card = this.deck.pop();
      this.grounds[i].push(card);
      if (j == i)
        card.isRevealed = true;
    }
  }
}

let clubPosition = new Vector2(380, 50);
let diamondPosition = new Vector2(550, 50);
let spadePosition = new Vector2(720, 50);
let heartPosition = new Vector2(890, 50);

GameWorld.prototype.update = function () {
  this.detectCards();
  Mouse.carrying = this.pressed.length != 0;
  for (i = 0; i < this.pressed.length; i++) {
    this.pressed[i].position = new Vector2(Mouse.position.x - 72, Mouse.position.y - (30 - 40 * i));
  }
}

GameWorld.prototype.draw = function () {
  Canvas.drawImage("frame-club", clubPosition);
  Canvas.drawImage("frame-diamond", diamondPosition);
  Canvas.drawImage("frame-spade", spadePosition);
  Canvas.drawImage("frame-heart", heartPosition);
  Canvas.drawImage("frame", deckPosition);
  for (i = 0; i < this.deck.size; i++) {
    Canvas.drawImage(this.deck.list[i].toString(), this.deck.list[i].position);
  }
  for (i = 0; i < this.pile.size; i++) {
    Canvas.drawImage(this.pile.list[i].toString(), this.pile.list[i].position);
  }
  for (i = 0; i < this.club.size; i++) {
    Canvas.drawImage(this.club.list[i].toString(), this.club.list[i].position);
  }
  for (i = 0; i < this.diamond.size; i++) {
    Canvas.drawImage(this.diamond.list[i].toString(), this.diamond.list[i].position);
  }
  for (i = 0; i < this.spade.size; i++) {
    Canvas.drawImage(this.spade.list[i].toString(), this.spade.list[i].position);
  }
  for (i = 0; i < this.heart.size; i++) {
    Canvas.drawImage(this.heart.list[i].toString(), this.heart.list[i].position);
  }
  for (i = 0; i < 7; i++) {
    for (j = 0; j < this.grounds[i].size; j++) {
      Canvas.drawImage(this.grounds[i].list[j].toString(), this.grounds[i].list[j].position);
    }
  }
  for (i = 0; i < this.pressed.length; i++) {
    Canvas.drawImage(this.pressed[i].toString(), this.pressed[i].position);
  }
}

GameWorld.prototype.detectCards = function () {
  if (Mouse.left.pressed) {
    //Check if user presses on card stack
    if (Mouse.isInRange(this.deck.position)) {
      if (this.deck.size > 0) {
        card = this.deck.pop();
        card.isRevealed = true;
        this.pile.push(card);
      } else {
        while (this.pile.size > 0) {
          card = this.pile.pop();
          card.isRevealed = false;
          this.deck.push(card);
        }
      }
    }

    if (Mouse.left.down) {
      if (!Mouse.carrying) {
        this.pressed = [];
        //Check if user presses on a card on a ground
        for (i = 0; i < this.grounds.length; i++) {
          for (j = this.grounds[i].size - 1; j >= 0; j--) {
            item = this.grounds[i].list[j];
            if (item.isRevealed && Mouse.isInRange(item.position)) {
              Mouse.takenDeck = item.deck;
              size = this.grounds[i].size;
              for (k = j; k < size; k++) {
                card = this.grounds[i].list[j];
                card.carried = true;
                card.deck.remove(card);
                this.pressed.push(card);
              }
              return;
            }
          }
        }
        //Check if user presses on a card on card pile
        if (Mouse.isInRange(this.pile.position) && this.pile.size > 0) {
          Mouse.takenDeck = this.pile;
          card = this.pile.peek();
          card.carried = true;
          card.deck.remove(card);
          this.pressed.push(card);
          return;
        }
        //Check if user presses on a card on suit stacks
        if(Mouse.isInRange(clubPosition) && this.club.size > 0){
          Mouse.takenDeck = this.club;
          card = this.club.peek();
          card.carried = true;
          card.deck.remove(card);
          this.pressed.push(card);
          return;
        }
        if(Mouse.isInRange(diamondPosition) && this.diamond.size > 0){
          Mouse.takenDeck = this.diamond;
          card = this.diamond.peek();
          card.carried = true;
          card.deck.remove(card);
          this.pressed.push(card);
          return;
        }
        if(Mouse.isInRange(spadePosition) && this.spade.size > 0){
          Mouse.takenDeck = this.spade;
          card = this.spade.peek();
          card.carried = true;
          card.deck.remove(card);
          this.pressed.push(card);
          return;
        }
        if(Mouse.isInRange(heartPosition) && this.heart.size > 0){
          Mouse.takenDeck = this.heart;
          card = this.heart.peek();
          card.carried = true;
          card.deck.remove(card);
          this.pressed.push(card);
          return;
        }
      }
    }
  } else if (!Mouse.left.down && this.pressed.length > 0) {
    cardOver = null;
    deckOver = null;
    for (i = 0; i < this.grounds.length; i++) {
      if (this.grounds[i].size > 0) {
        card = this.grounds[i].peek();
        if (!card.carried && Mouse.isInRange(card.position)) {
          cardOver = card;
          deckOver = this.grounds[i];
          break;
        }
      } else {
        if (Mouse.isInRange(this.grounds[i].position)) {
          deckOver = this.grounds[i];
          break;
        }
      }
    }
    if (deckOver == null && this.pressed.length == 1) {
      card = this.pressed[0];
      card.carried = false;
      if (card.suit == 'club' && Mouse.isInRange(clubPosition) && ((card.value == 1 && this.club.size == 0) || (this.club.size > 0 && card.value - this.club.peek().value == 1))) {
        this.club.push(card);
        if (Mouse.takenDeck.peek() != null && !Mouse.takenDeck.peek().isRevealed) {
          Mouse.takenDeck.peek().isRevealed = true;
        }
      } else if (card.suit == 'diamond' && Mouse.isInRange(diamondPosition) && ((card.value == 1 && this.diamond.size == 0) || (this.diamond.size > 0 && card.value - this.diamond.peek().value == 1))) {
        this.diamond.push(card);
        if (Mouse.takenDeck.peek() != null && !Mouse.takenDeck.peek().isRevealed) {
          Mouse.takenDeck.peek().isRevealed = true;
        }
      } else if (card.suit == 'spade' && Mouse.isInRange(spadePosition) && ((card.value == 1 && this.spade.size == 0) || (this.spade.size > 0 && card.value - this.spade.peek().value == 1))) {
        this.spade.push(card);
        if (Mouse.takenDeck.peek() != null && !Mouse.takenDeck.peek().isRevealed) {
          Mouse.takenDeck.peek().isRevealed = true;
        }
      } else if (card.suit == 'heart' && Mouse.isInRange(heartPosition) && ((card.value == 1 && this.heart.size == 0) || (this.heart.size > 0 && card.value - this.heart.peek().value == 1))) {
        this.heart.push(card);
        if (Mouse.takenDeck.peek() != null && !Mouse.takenDeck.peek().isRevealed) {
          Mouse.takenDeck.peek().isRevealed = true;
        }
      } else {
        Mouse.takenDeck.push(card);
      }
    } else if (this.pressed.length > 0 && deckOver != null && this.canPlay(this.pressed[0], cardOver)) {
      for (i = 0; i < this.pressed.length; i++) {
        this.pressed[i].carried = false;
        if (deckOver != null) {
          deckOver.push(this.pressed[i]);
          if (Mouse.takenDeck.peek() != null && !Mouse.takenDeck.peek().isRevealed) {
            Mouse.takenDeck.peek().isRevealed = true;
          }
        } else {
          Mouse.takenDeck.push(this.pressed[i]);
        }
      }
    } else {
      for (i = 0; i < this.pressed.length; i++) {
        this.pressed[i].carried = false;
        Mouse.takenDeck.push(this.pressed[i]);
      }
    }
    Mouse.takenDeck = null;
    this.pressed = [];
  }
}

GameWorld.prototype.canPlay = function (card, top) {
  if (top == null)
    return card.value == 13;
  if ((card.suit == 'club' || card.suit == 'spade') && (top.suit == 'diamond' || top.suit == 'heart')) {
    return top.value - card.value == 1;
  }
  if ((card.suit == 'diamond' || card.suit == 'heart') && (top.suit == 'club' || top.suit == 'spade')) {
    return top.value - card.value == 1;
  }
  return false;
}