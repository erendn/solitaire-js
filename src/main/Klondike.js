class Klondike extends GameWorld {

    constructor() {
        super();
        this.deck = new Stack();
        this.waste = new Stack();
        this.piles = [];
        for (var i = 0; i < 7; i++) {
            this.piles.push(new Stack());
        }
        this.foundations = [];
        for (var i = 0; i < 4; i++) {
            this.foundations.push(new Stack());
        }
        this.generate();
        this.gameStack = new GameStack();
        this.movesAvailable = true;
    }

    /**
     * Performs the Klondike generation algorithm. This function guarantees a Klondike game with at least one valid solution.
     */
    generate() {
        this.deck.openDeck();
        this.deck.shuffle();
        var solved = [];
        for (var i = 0; i < 4; i++) {
            solved.push(new Stack());
            for (var j = 0; j < this.deck.size(); j++) {
                if (solved[i].size() == 0 && this.deck.get(j).rank == 13) {
                    solved[i].push(this.deck.take(j));
                    j = -1;
                } else if (solved[i].size() > 0
                    && this.deck.get(j).rank + 1 == solved[i].peek().rank
                    && this.deck.get(j).getColor() != solved[i].peek().getColor()) {
                    solved[i].push(this.deck.take(j));
                    j = -1;
                }
            }
        }
        var availablePiles = Utils.shuffle([...this.piles.keys()]);
        while (solved[0].size() > 0) {
            var reduced = solved[0].size() - 1;
            for (var i = 0; i < 4; i++) {
                while (solved[i].size() > reduced) {
                    var random = Math.random();
                    if (availablePiles.length > 0 && random < 0.5) {
                        random = availablePiles[Math.floor(random * availablePiles.length)];
                        this.piles[random].push(solved[i].pop());
                        if (this.piles[random].size() == random + 1) {
                            availablePiles = availablePiles.filter(index => index != random);
                        }
                    } else {
                        var card = solved[i].peek();
                        var placed = false;
                        for (var j = 0; j < 4; j++) {
                            if (this.foundations[j].size() == 0) {
                                this.foundations[j].push(solved[i].pop());
                                placed = true;
                                break;
                            } else if (this.foundations[j].peek().suit == card.suit && this.foundations[j].peek().rank == card.rank + 1) {
                                this.foundations[j].push(solved[i].pop());
                                placed = true;
                                break;
                            }
                        }
                        if (!placed) {
                            this.deck.push(solved[i].pop());
                        }
                    }
                }
            }
        }
        for (var i = 0; i < this.foundations.length; i++)
            while (this.foundations[i].size() > 0)
                this.deck.push(this.foundations[i].pop());
        this.deck.shuffle();
        for (var i = 0; i < 7; i++) {
            while (this.piles[i].size() <= i) {
                this.piles[i].push(this.deck.pop());
            }
            for (var j = 0; j < this.piles[i].size(); j++) {
                if (j < this.piles[i].size() - 1) {
                    this.piles[i].get(j).revealed = false;
                }
            }
        }
        this.deck.forEach(element => element.revealed = false);
        this.deck.shuffle();
    }

    play() {

    }

    update() {
        if (Mouse.clicked) {
            Mouse.clicked = false;
            if (Utils.pointInRectangle(Mouse.position, this.deck.position, DIMENSIONS.CARD.width, DIMENSIONS.CARD.height)) {
                var move = new GameNode();
                if (this.deck.size() > 0) {
                    move.cardsMoved = [this.deck.peek()];
                    move.movedFrom = this.deck;
                    move.movedTo = this.waste;
                    move.cardsRevealed = [this.deck.peek()];
                } else {
                    move.cardsMoved = [];
                    move.movedFrom = this.waste;
                    move.movedTo = this.deck;
                    move.cardsUnrevealed = [];
                    for (var i = 0; i < this.waste.size(); i++) {
                        move.cardsMoved.push(this.waste.get(i));
                        move.cardsUnrevealed.push(this.waste.get(i));
                    }
                }
                this.gameStack.push(move);
            }
        } else if (Mouse.pressed.KEY_CTRL && Mouse.pressed.MOUSE_0) {
            Mouse.ctrlClicked = false;
            
        } else if (Mouse.pressed.MOUSE_0) {
            if (Mouse.carried.length == 0) {
                for (var i = 0; i < 7; i++) {
                    for (var j = this.piles[i].size() - 1; j >= 0; j--) {
                        if (Utils.pointInRectangle(Mouse.position, this.piles[i].get(j).position, DIMENSIONS.CARD.width, DIMENSIONS.CARD.height) && this.piles[i].get(j).revealed) {
                            Mouse.offset = Vector2.diff(Mouse.position, this.piles[i].get(j).position);
                            Mouse.carried = this.piles[i].list.slice(j);
                            Mouse.carried.forEach(element => element.moving = true);
                            return;
                        }
                    }
                }
                for (var i = 0; i < 4; i++) {
                    if (this.foundations[i].size() > 0 && Utils.pointInRectangle(Mouse.position, this.foundations[i].position, DIMENSIONS.CARD.width, DIMENSIONS.CARD.height)) {
                        Mouse.offset = Vector2.diff(Mouse.position, this.foundations[i].position);
                        Mouse.carried = [this.foundations[i].peek()];
                        Mouse.carried[0].moving = true;
                        return;
                    }
                }
                if (this.waste.size() > 0 && Utils.pointInRectangle(Mouse.position, this.waste.position, DIMENSIONS.CARD.width, DIMENSIONS.CARD.height)) {
                    Mouse.offset = Vector2.diff(Mouse.position, this.waste.position);
                    Mouse.carried = [this.waste.peek()];
                    Mouse.carried[0].moving = true;
                    return;
                }
            }
        } else if (Mouse.carried.length > 0) {
            for (var i = 0; i < 7; i++) {
                if (this.piles[i].size() > 0
                    && Utils.pointInRectangle(Vector2.add(Vector2.diff(Mouse.position, Mouse.offset), new Vector2(DIMENSIONS.CARD.width / 2, DIMENSIONS.CARD.height / 2)), this.piles[i].peek().position, DIMENSIONS.CARD.width, DIMENSIONS.CARD.height)
                    && Mouse.carried[0].rank + 1 == this.piles[i].peek().rank
                    && Mouse.carried[0].getColor() != this.piles[i].peek().getColor()) {
                    var move = new GameNode();
                    move.cardsMoved = Mouse.carried.reverse();
                    move.movedFrom = move.cardsMoved[0].stack;
                    move.movedTo = this.piles[i];
                    if (move.movedFrom.size() > move.cardsMoved.length && !move.movedFrom.get(move.movedFrom.size() - move.cardsMoved.length - 1).revealed)
                        move.cardsRevealed = [move.movedFrom.get(move.movedFrom.size() - move.cardsMoved.length - 1)];
                    Mouse.carried = [];
                    this.gameStack.push(move);
                    return;
                } else if (this.piles[i].size() == 0
                    && Utils.pointInRectangle(Vector2.add(Vector2.diff(Mouse.position, Mouse.offset), new Vector2(DIMENSIONS.CARD.width / 2, DIMENSIONS.CARD.height / 2)), this.piles[i].position, DIMENSIONS.CARD.width, DIMENSIONS.CARD.height)
                    && Mouse.carried[0].rank == 13) {
                    var move = new GameNode();
                    move.cardsMoved = Mouse.carried.reverse();
                    move.movedFrom = move.cardsMoved[0].stack;
                    move.movedTo = this.piles[i];
                    if (move.movedFrom.size() > move.cardsMoved.length && !move.movedFrom.get(move.movedFrom.size() - move.cardsMoved.length - 1).revealed)
                        move.cardsRevealed = [move.movedFrom.get(move.movedFrom.size() - move.cardsMoved.length - 1)];
                    Mouse.carried = [];
                    this.gameStack.push(move);
                    return;
                }
            }
            if (Mouse.carried.length == 1) {
                for (var i = 0; i < 4; i++) {
                    if (this.foundations[i].size() > 0
                        && Utils.pointInRectangle(Vector2.add(Vector2.diff(Mouse.position, Mouse.offset), new Vector2(DIMENSIONS.CARD.width / 2, DIMENSIONS.CARD.height / 2)), this.foundations[i].position, DIMENSIONS.CARD.width, DIMENSIONS.CARD.height)
                        && Mouse.carried[0].rank == this.foundations[i].peek().rank + 1
                        && Mouse.carried[0].suit == this.foundations[i].peek().suit) {
                        var move = new GameNode();
                        move.cardsMoved = Mouse.carried;
                        move.movedFrom = Mouse.carried[0].stack;
                        move.movedTo = this.foundations[i];
                        if (move.movedFrom.size() > move.cardsMoved.length && !move.movedFrom.get(move.movedFrom.size() - 2).revealed)
                            move.cardsRevealed = [move.movedFrom.get(move.movedFrom.size() - 2)];
                        Mouse.carried = [];
                        this.gameStack.push(move);
                        return;
                    } else if (this.foundations[i].size() == 0
                        && Utils.pointInRectangle(Vector2.add(Vector2.diff(Mouse.position, Mouse.offset), new Vector2(DIMENSIONS.CARD.width / 2, DIMENSIONS.CARD.height / 2)), this.foundations[i].position, DIMENSIONS.CARD.width, DIMENSIONS.CARD.height)
                        && Mouse.carried[0].rank == 1) {
                        var move = new GameNode();
                        move.cardsMoved = Mouse.carried;
                        move.movedFrom = Mouse.carried[0].stack;
                        move.movedTo = this.foundations[i];
                        if (move.movedFrom.size() > move.cardsMoved.length && !move.movedFrom.get(move.movedFrom.size() - 2).revealed)
                            move.cardsRevealed = [move.movedFrom.get(move.movedFrom.size() - 2)];
                        Mouse.carried = [];
                        this.gameStack.push(move);
                        return;
                    }
                }
            }
            Mouse.carried.forEach(element => element.moving = false);
            Mouse.carried = [];
        } else if (Mouse.pressed.KEY_CTRL && Mouse.pressed.KEY_Z) {
            Mouse.pressed.KEY_Z = false;
            this.gameStack.undo();
        } else if (Mouse.pressed.KEY_CTRL && Mouse.pressed.KEY_Y) {
            Mouse.pressed.KEY_Y = false;
            this.gameStack.redo();
        }

    }

    render() {
        Canvas.fill(COLORS.BACKGROUND[SETTINGS.BACKGROUND_COLOR]);
        //RENDERING FOUNDATIONS
        for (var i = 0; i < 4; i++) {
            this.foundations[i].position = new Vector2((i + 1) * DIMENSIONS.STACK_OFFSET.width + DIMENSIONS.CARD.width * i, DIMENSIONS.TOPBAR.height + DIMENSIONS.STACK_OFFSET.height);
            Canvas.drawImage(SPRITES['frame-empty'], this.foundations[i].position, DIMENSIONS.CARD.width, DIMENSIONS.CARD.height);
            for (var j = 0; j < this.foundations[i].size(); j++) {
                if (!this.foundations[i].get(j).moving)
                    Canvas.drawImage(SPRITES[this.foundations[i].get(j).getSpriteName()], this.foundations[i].position, DIMENSIONS.CARD.width, DIMENSIONS.CARD.height);
            }
        }
        //RENDERING DECK AND WASTE
        this.waste.position = new Vector2(6 * DIMENSIONS.STACK_OFFSET.width + DIMENSIONS.CARD.width * 5, DIMENSIONS.TOPBAR.height + DIMENSIONS.STACK_OFFSET.height);
        for (var i = 0; i < this.waste.size(); i++) {
            if (!this.waste.get(i).moving)
                Canvas.drawImage(SPRITES[this.waste.get(i).getSpriteName()], this.waste.position, DIMENSIONS.CARD.width, DIMENSIONS.CARD.height);
        }
        this.deck.position = new Vector2(7 * DIMENSIONS.STACK_OFFSET.width + DIMENSIONS.CARD.width * 6, DIMENSIONS.TOPBAR.height + DIMENSIONS.STACK_OFFSET.height);
        Canvas.drawImage(SPRITES['frame'], this.deck.position, DIMENSIONS.CARD.width, DIMENSIONS.CARD.height);
        for (var i = 0; i < this.deck.size(); i++) {
            Canvas.drawImage(SPRITES[this.deck.get(i).getSpriteName()], this.deck.position, DIMENSIONS.CARD.width, DIMENSIONS.CARD.height);
        }
        //RENDERING PILES
        for (var i = 0; i < 7; i++) {
            var position = new Vector2((i + 1) * DIMENSIONS.STACK_OFFSET.width + DIMENSIONS.CARD.width * i, DIMENSIONS.TOPBAR.height + DIMENSIONS.CARD.height + 2 * DIMENSIONS.STACK_OFFSET.height);
            this.piles[i].position = { ...position };
            for (var j = 0; j < this.piles[i].size(); j++) {
                var card = this.piles[i].get(j);
                card.position = { ...position };
                if (!card.moving) {
                    Canvas.drawImage(SPRITES[card.getSpriteName()], card.position, DIMENSIONS.CARD.width, DIMENSIONS.CARD.height);
                    position.y += card.revealed ? 200 / (4 * (this.piles[i].size() / 14 + 1)) : DIMENSIONS.CARD_OFFSET.width;
                }
            }
        }
        //RENDERING CARRIED CARDS
        var position = new Vector2(Mouse.position.x - Mouse.offset.x, Mouse.position.y - Mouse.offset.y);
        for (var i = 0; i < Mouse.carried.length; i++) {
            Canvas.drawImage(SPRITES[Mouse.carried[i].getSpriteName()], position, DIMENSIONS.CARD.width, DIMENSIONS.CARD.height);
            position.y += i == 0 ? 50 : 10;
        }
        //RENDERING TOPBAR
        Canvas.drawRect(origin, Canvas.width, DIMENSIONS.TOPBAR.height, COLORS.BACKGROUND.DARKER_GREEN, 0.7);
    }
}