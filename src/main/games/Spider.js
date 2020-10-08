class Spider extends GameWorld {

    constructor() {
        super();
        this.deck = new Stack(true, 'frame');
        this.foundations = [];
        for (var i = 0; i < 8; i++) {
            this.foundations.push(new Stack(true));
        }
        this.piles = [];
        for (var i = 0; i < 10; i++) {
            this.piles.push(new Stack());
        }
        this.stacksOnGround = this.piles.concat(this.foundations, this.deck);
        this.generate();
    }

    generate() {
        // Creating a solved game
        for (var i = 0; i < 2; i++) {
            this.deck.openDeck();
        }
        this.deck.shuffle();
        var solved = [];
        for (var i = 0; i < this.foundations.length; i++) {
            solved.push(new Stack());
            for (var j = 0; j < this.deck.size(); j++) {
                if (solved[i].size() == 0 && this.deck.get(j).rank == 13) {
                    solved[i].push(this.deck.take(j));
                    j = -1;
                } else if (solved[i].size() > 0
                    && this.deck.get(j).rank + 1 == solved[i].peek().rank
                    && this.deck.get(j).getColor() == solved[i].peek().getColor()) {
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
            if (random < 0.5) {
                random = availablePiles[Math.floor(random * availablePiles.length)];
                this.piles[random].push(solved[i].pop());
                if ((random < 4 && this.piles[random].size() == 6) || (random >= 4 && this.piles[random].size() == 5)) {
                    availablePiles = availablePiles.filter(index => index != random);
                }
            } else {
                var card = solved[i].peek();
                var found = false;
                for (var j = 0; j < this.foundations.length; j++) {
                    if (this.foundations[j].size() == 0 || (this.foundations[j].peek().suit == card.suit && this.foundations[j].peek().rank == card.rank + 1)) {
                        this.foundations[j].push(solved[i].pop());
                        found = true;
                        break;
                    }
                }
                if (!found)
                    this.deck.push(solved[i].pop());
            }
        }
        for (var i = 0; i < this.foundations.length; i++) {
            while (this.foundations[i].size() > 0) {
                if (availablePiles.length > 0) {
                    var random = availablePiles[Math.floor(Math.random() * availablePiles.length)];
                    this.piles[random].push(this.foundations[i].pop());
                    if ((random < 4 && this.piles[random].size() == 6) || (random >= 4 && this.piles[random].size() == 5)) {
                        availablePiles = availablePiles.filter(index => index != random);
                    }
                } else {
                    this.deck.push(this.foundations[i].pop());
                }
            }
        }
        this.deck.shuffle();
        for (var i = 0; i < this.piles.length; i++) {
            while ((i < 4 && this.piles[i].size() < 6) || (i >= 4 && this.piles[i].size() < 5)) {
                this.piles[i].push(this.deck.pop());
            }
            for (var j = 0; j < this.piles[i].size(); j++) {
                if (j < this.piles[i].size() - 1) {
                    this.piles[i].get(j).revealed = false;
                }
            }
        }
        this.deck.forEach(element => element.revealed = false);
    }

    play() {
        if (this.gameOver || this.deck.position == undefined)
            return;
        // If there is a solved pile, moves it to a foundation
        for (var i = 0; i < this.piles.length; i++) {
            var rank = 1;
            for (var j = this.piles[i].size() - 1; j >= 0; j--) {
                if (this.piles[i].get(j).rank != rank)
                    break;
                if (rank++ == 13) {
                    var stack = null;
                    for (var k = 0; k < this.foundations.length; k++) {
                        if (this.foundations[k].size() == 0) {
                            stack = this.foundations[k];
                            break;
                        }
                    }
                    this.moveCards(this.piles[i].slice(j), stack);
                }
            }
        }
        // Checks if the game is over
        if (this.deck.size() == 0 && this.piles.every(stack => stack.size() == 0)) {
            this.gameOver = true;
        }
        if (Mouse.clicked) {
            Mouse.clicked = false;
            // Performs fast-play if possible
            if (Mouse.pressed.KEY_CTRL) {
                for (var i = 0; i < this.piles.length; i++) {
                    for (var j = this.piles[i].size() - 1; j >= 0; j--) {
                        if (Utils.pointInRectangle(Mouse.position, this.piles[i].get(j).position, DIMENSIONS.CARD.width, DIMENSIONS.CARD.height) && this.piles[i].get(j).revealed) {
                            var chosen = this.piles[i].slice(j);
                            if (this.isValidSet(chosen)) {
                                var available = this.getAvailableMoves(chosen[0]);
                                if (available.length > 0) {
                                    this.moveCards(chosen.reverse(), available[0]);
                                }
                                return;
                            }
                        }
                    }
                }
            } else {
                if (Utils.pointInRectangle(Mouse.position, this.deck.position, DIMENSIONS.CARD.width, DIMENSIONS.CARD.height)) {
                    if (this.deck.size() > 0 && this.piles.every(stack => stack.size() > 0)) {
                        var cards = this.deck.slice(Math.max(0, this.deck.size() - this.piles.length)).reverse();
                        this.moveCards(cards, this.piles.slice(0, cards.length), cards);
                    }
                }
            }
        } else if (Mouse.pressed.MOUSE_0 && !Mouse.pressed.KEY_CTRL) {
            if (Mouse.carried.length == 0) {
                for (var i = 0; i < this.piles.length; i++) {
                    for (var j = this.piles[i].size() - 1; j >= 0; j--) {
                        if (Utils.pointInRectangle(Mouse.position, this.piles[i].get(j).position, DIMENSIONS.CARD.width, DIMENSIONS.CARD.height) && this.piles[i].get(j).revealed && this.isValidSet(this.piles[i].slice(j))) {
                            Mouse.offset = Vector2.diff(Mouse.position, this.piles[i].get(j).position);
                            Mouse.carried = this.piles[i].slice(j);
                            Mouse.carried.forEach(element => element.moving = true);
                            return;
                        }
                    }
                }
            }
        } else if (Mouse.carried.length > 0) {
            for (var i = 0; i < this.piles.length; i++) {
                if (this.piles[i].size() > 0
                    && Utils.pointInRectangle(Vector2.add(Vector2.diff(Mouse.position, Mouse.offset), new Vector2(DIMENSIONS.CARD.width / 2, DIMENSIONS.CARD.height / 2)), this.piles[i].peek().position, DIMENSIONS.CARD.width, DIMENSIONS.CARD.height)
                    && this.isValidMove(Mouse.carried[0], this.piles[i])) {
                    this.moveCards(Mouse.carried.reverse(), this.piles[i]);
                    Mouse.carried = [];
                    return;
                } else if (this.piles[i].size() == 0
                    && Utils.pointInRectangle(Vector2.add(Vector2.diff(Mouse.position, Mouse.offset), new Vector2(DIMENSIONS.CARD.width / 2, DIMENSIONS.CARD.height / 2)), this.piles[i].position, DIMENSIONS.CARD.width, DIMENSIONS.CARD.height)) {
                    this.moveCards(Mouse.carried.reverse(), this.piles[i]);
                    Mouse.carried = [];
                    return;
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
        for (var i = 0; i < this.foundations.length; i++) {
            this.foundations[i].position = new Vector2((i + 1) * DIMENSIONS.STACK_OFFSET.width + DIMENSIONS.CARD.width * i, DIMENSIONS.STACK_OFFSET.height);
        }
        this.deck.position = new Vector2(this.piles.length * DIMENSIONS.STACK_OFFSET.width + DIMENSIONS.CARD.width * (this.piles.length - 1), DIMENSIONS.STACK_OFFSET.height);
        for (var i = 0; i < this.piles.length; i++) {
            this.piles[i].position = new Vector2((i + 1) * DIMENSIONS.STACK_OFFSET.width + DIMENSIONS.CARD.width * i, DIMENSIONS.CARD.height + 2 * DIMENSIONS.STACK_OFFSET.height);
        }
    }

    getHints() {
        var moves = [];
        for (var i = 0; i < this.piles.length; i++) {
            if (this.piles[i].size() > 0) {
                var available = null;
                var cards = null;
                for (var j = this.piles[i].size() - 1; j >= 0; j--) {
                    if (this.piles[i].get(j).revealed) {
                        cards = this.piles[i].slice(j);
                        if (this.isValidSet(cards)) {
                            var found = this.getAvailableMoves(cards[0]);
                            if (found.length > 0 && cards[0].rank != 13) {
                                available = found;
                                break;
                            }
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

    getAvailableMoves(card) {
        var stacks = [];
        for (var i = 0; i < this.piles.length; i++) {
            if (this.piles[i].size() == 0 || (this.piles[i].size() > 0 && this.isValidMove(card, this.piles[i])))
                stacks.push(this.piles[i]);
        }
        return stacks;
    }

    isValidMove(card, targetStack) {
        var top = targetStack.peek();
        return card.getColor() != top.getColor() && card.rank + 1 == top.rank;
    }

    isValidSet(cards) {
        for (var i = 0; i < cards.length - 1; i++) {
            if (cards[i].getColor() != cards[i + 1].getColor() && cards[i].rank != cards[i + 1].rank + 1)
                return false;
        }
        return true;
    }

}