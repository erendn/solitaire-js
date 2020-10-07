class Klondike extends GameWorld {

    constructor() {
        super();
        this.deck = new Stack(true, 'frame');
        this.waste = new Stack(true);
        this.piles = [];
        for (var i = 0; i < 7; i++) {
            this.piles.push(new Stack());
        }
        this.foundations = [];
        for (var i = 0; i < 4; i++) {
            this.foundations.push(new Stack(true, 'frame-empty'));
        }
        this.stacksOnGround = this.foundations.concat(this.deck, this.waste, this.piles);
        this.generate();
    }

    generate() {
        // Creating a solved game
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
        // Randomly placing cards to the ground backwards from a solved game
        var availablePiles = Utils.shuffle([...this.piles.keys()]);
        while (availablePiles.length > 0 && solved.some(element => element.size() > 0)) {
            var i = Math.floor(Math.random() * solved.length);
            if (solved[i].size() == 0)
                continue;
            var random = Math.random();
            if (availablePiles.length > 0 && random < 0.5) {
                random = availablePiles[Math.floor(random * availablePiles.length)];
                this.piles[random].push(solved[i].pop());
                if (this.piles[random].size() == random + 1) {
                    availablePiles = availablePiles.filter(index => index != random);
                }
            } else {
                var card = solved[i].peek();
                var found = false;
                for (var j = 0; j < 4; j++) {
                    if (this.foundations[j].size() == 0) {
                        this.foundations[j].push(solved[i].pop());
                        found = true;
                        break;
                    } else if (this.foundations[j].peek().suit == card.suit && this.foundations[j].peek().rank == card.rank + 1) {
                        this.foundations[j].push(solved[i].pop());
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    this.deck.push(solved[i].pop());
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
        if (this.gameOver || this.deck.position == undefined)
            return;
        // Checks whether the game has already been solved and rest of the moves can be performed automatically
        if (!this.autoPlay && this.deck.size() == 0 && this.waste.size() == 0 && !this.piles.some(stack => stack.some(element => !element.revealed))) {
            this.autoPlay = true;
        }
        // If the game has already been solved, performs rest of the moves automatically
        if (this.autoPlay) {
            while (this.piles.some(element => element.size() > 0)) {
                for (var i = 0; i < 7; i++) {
                    while (this.piles[i].size() > 0) {
                        var card = this.piles[i].peek();
                        var found = false;
                        for (var j = 0; j < 4; j++) {
                            if ((this.foundations[j].size() > 0 && this.isValidMove(card, this.foundations[j])) || (this.foundations[j].size() == 0 && card.rank == 1)) {
                                this.moveCards([card], this.foundations[j]);
                                found = true;
                                break;
                            }
                        }
                        if (!found)
                            break;
                    }
                }
            }
        }
        // Checks if the game is over
        if (this.deck.size() == 0 && this.waste.size() == 0 && !this.piles.some(stack => stack.size() > 0)) {
            this.gameOver = true;
        }
        if (Mouse.clicked) {
            Mouse.clicked = false;
            // Performs fast-play if possible
            if (Mouse.pressed.KEY_CTRL) {
                for (var i = 0; i < 7; i++) {
                    for (var j = this.piles[i].size() - 1; j >= 0; j--) {
                        if (Utils.pointInRectangle(Mouse.position, this.piles[i].get(j).position, DIMENSIONS.CARD.width, DIMENSIONS.CARD.height) && this.piles[i].get(j).revealed) {
                            var chosen = this.piles[i].slice(j);
                            var available = this.getAvailableMoves(chosen[0], chosen.length > 1);
                            if (available.length > 0) {
                                this.moveCards(chosen.reverse(), available[0]);
                            }
                            return;
                        }
                    }
                }
                for (var i = 0; i < 4; i++) {
                    if (this.foundations[i].size() > 0 && Utils.pointInRectangle(Mouse.position, this.foundations[i].position, DIMENSIONS.CARD.width, DIMENSIONS.CARD.height)) {
                        var chosen = this.foundations[i].peek();
                        var available = this.getAvailableMoves(chosen);
                        if (available.length > 0) {
                            this.moveCards([chosen], available[0]);
                        }
                        return;
                    }
                }
                if (this.waste.size() > 0 && Utils.pointInRectangle(Mouse.position, this.waste.position, DIMENSIONS.CARD.width, DIMENSIONS.CARD.height)) {
                    var chosen = this.waste.peek();
                    var available = this.getAvailableMoves(chosen);
                    if (available.length > 0) {
                        this.moveCards([chosen], available[0]);
                    }
                    return;
                }
            } else {
                if (Utils.pointInRectangle(Mouse.position, this.deck.position, DIMENSIONS.CARD.width, DIMENSIONS.CARD.height)) {
                    if (this.deck.size() > 0) {
                        this.moveCards([this.deck.peek()], this.waste, [this.deck.peek()]);
                    } else if (this.waste.size() > 0) {
                        var wasteCopy = this.waste.copy();
                        this.moveCards(wasteCopy, this.deck, null, wasteCopy);
                    }
                }
            }
        } else if (Mouse.pressed.MOUSE_0 && !Mouse.pressed.KEY_CTRL) {
            if (Mouse.carried.length == 0) {
                for (var i = 0; i < 7; i++) {
                    for (var j = this.piles[i].size() - 1; j >= 0; j--) {
                        if (Utils.pointInRectangle(Mouse.position, this.piles[i].get(j).position, DIMENSIONS.CARD.width, DIMENSIONS.CARD.height) && this.piles[i].get(j).revealed) {
                            Mouse.offset = Vector2.diff(Mouse.position, this.piles[i].get(j).position);
                            Mouse.carried = this.piles[i].slice(j);
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
                    && this.isValidMove(Mouse.carried[0], this.piles[i])) {
                    this.moveCards(Mouse.carried.reverse(), this.piles[i]);
                    Mouse.carried = [];
                    return;
                } else if (this.piles[i].size() == 0
                    && Utils.pointInRectangle(Vector2.add(Vector2.diff(Mouse.position, Mouse.offset), new Vector2(DIMENSIONS.CARD.width / 2, DIMENSIONS.CARD.height / 2)), this.piles[i].position, DIMENSIONS.CARD.width, DIMENSIONS.CARD.height)
                    && Mouse.carried[0].rank == 13) {
                    this.moveCards(Mouse.carried.reverse(), this.piles[i]);
                    Mouse.carried = [];
                    return;
                }
            }
            if (Mouse.carried.length == 1) {
                for (var i = 0; i < 4; i++) {
                    if (Utils.pointInRectangle(Vector2.add(Vector2.diff(Mouse.position, Mouse.offset), new Vector2(DIMENSIONS.CARD.width / 2, DIMENSIONS.CARD.height / 2)), this.foundations[i].position, DIMENSIONS.CARD.width, DIMENSIONS.CARD.height)
                        && ((this.foundations[i].size() > 0 && this.isValidMove(Mouse.carried[0], this.foundations[i])) || (this.foundations[i].size() == 0 && Mouse.carried[0].rank == 1))) {
                        this.moveCards(Mouse.carried, this.foundations[i]);
                        Mouse.carried = [];
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
        } else if (Mouse.pressed.KEY_H) {
            Mouse.pressed.KEY_H = false;
            this.movesAvailable = this.getHints();
            if (this.movesAvailable.length > 0) {
                if (this.showHint == null) {
                    this.showHint = {
                        index: 0,
                        step: 0
                    };
                } else {
                    this.showHint.index = (this.showHint.index + 1) % this.movesAvailable.length;
                    this.showHint.step = 0;
                }
            }
        }
    }

    update() {
        // Updating positions of all stacks on the ground
        for (var i = 0; i < 4; i++) {
            this.foundations[i].position = new Vector2((i + 1) * DIMENSIONS.STACK_OFFSET.width + DIMENSIONS.CARD.width * i, DIMENSIONS.STACK_OFFSET.height);
        }
        this.waste.position = new Vector2(6 * DIMENSIONS.STACK_OFFSET.width + DIMENSIONS.CARD.width * 5, DIMENSIONS.STACK_OFFSET.height);
        this.deck.position = new Vector2(7 * DIMENSIONS.STACK_OFFSET.width + DIMENSIONS.CARD.width * 6, DIMENSIONS.STACK_OFFSET.height);
        for (var i = 0; i < 7; i++) {
            this.piles[i].position = new Vector2((i + 1) * DIMENSIONS.STACK_OFFSET.width + DIMENSIONS.CARD.width * i, DIMENSIONS.CARD.height + 2 * DIMENSIONS.STACK_OFFSET.height);
        }
    }

    getHints() {
        var moves = [];
        for (var i = 0; i < 7; i++) {
            if (this.piles[i].size() > 0) {
                var available = null;
                var cards = null;
                for (var j = this.piles[i].size() - 1; j >= 0; j--) {
                    if (this.piles[i].get(j).revealed) {
                        cards = this.piles[i].slice(j);
                        var found = this.getAvailableMoves(cards[0], cards.length > 1);
                        if (found.length > 0 && cards[0].rank != 13) {
                            available = found;
                            break;
                        }
                    }
                }
                for (var j = 0; available != null && j < available.length; j++) {
                    moves.push({
                        terminal: cards[0].position,
                        destination: available[j].size() > 0 ? available[j].peek().position : available[j].position,
                        cards: cards
                    });
                }
            }
        }
        return moves;
    }

    getAvailableMoves(card, stacked = false) {
        var stacks = [];
        if (!stacked) {
            for (var i = 0; i < 4; i++) {
                if (this.foundations[i].size() > 0 && this.isValidMove(card, this.foundations[i])) {
                    stacks.push(this.foundations[i]);
                } else if (this.foundations[i].size() == 0 && card.rank == 1) {
                    stacks.push(this.foundations[i]);
                }
            }
        }
        for (var i = 0; i < 7; i++) {
            if (this.piles[i].size() > 0 && this.isValidMove(card, this.piles[i])) {
                stacks.push(this.piles[i]);
            } else if (this.piles[i].size() == 0 && card.rank == 13) {
                stacks.push(this.piles[i]);
            }
        }
        return stacks;
    }

    isValidMove(card, targetStack) {
        if (targetStack.stacked) {
            var top = targetStack.peek();
            return card.suit == top.suit && card.rank == top.rank + 1;
        } else {
            var top = targetStack.peek();
            return card.getColor() != top.getColor() && card.rank + 1 == top.rank;
        }
    }

}