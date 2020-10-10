class Pyramid extends GameWorld {

    constructor() {
        super();
        this.deck = new Stack(true, 'frame');
        this.waste = new Stack(true);
        this.pyramid = new PyramidStack();
        this.stacksOnGround = [this.deck, this.waste, this.pyramid];
        this.pile = new Stack(true, 'frame-empty');
        this.generate();
        this.chosenCards = [];
    }

    generate() {
        // Creating a solved game
        this.deck.openDeck();
        this.deck.shuffle();
        var solved = [];
        while (this.deck.size() > 0) {
            var tuple = [this.deck.pop()];
            if (tuple[0].rank != 13) {
                for (var i = 0; i < this.deck.size(); i++) {
                    if (this.deck.get(i).rank + tuple[0].rank == 13) {
                        tuple.push(this.deck.take(i));
                        break;
                    }
                }
            }
            solved.push(tuple);
        }
        // Randomly placing cards to the ground backwards from a solved game
        while (this.pyramid.size() < 28) {
            var random = Math.random();
            var index = Math.floor(random * solved.length);
            if (solved[index].length)
                this.pyramid.push(solved[index].pop());
        }
        // Putting remaining cards to the deck
        for (var i = 0; i < solved.length; i++) {
            if (solved[i].length > 0)
                this.deck.push(solved[i--].pop());
        }
        this.deck.forEach(element => element.revealed = false);
        this.deck.shuffle();
    }

    play() {
        if (this.gameOver || this.deck.position == undefined)
            return;
        // Checks if the game is over
        if (!this.pyramid.size()) {
            this.gameOver = true;
        }
        if (Mouse.clicked) {
            Mouse.clicked = false;
            if (this.chosenCards.length == 2) {
                var sum = 0;
                this.chosenCards.forEach(element => {
                    sum += element.rank;
                    element.highlighted = false;
                });
                if (sum == 13) {
                    this.moveCards(this.chosenCards.reverse(), this.pile);
                }
                this.chosenCards = [];
            } else if (this.chosenCards.length == 1 && this.chosenCards[0].rank == 13) {
                this.chosenCards[0].highlighted = false;
                this.moveCards(this.chosenCards, this.pile);
                this.chosenCards = [];
            }
        } else if (Mouse.pressed.MOUSE_0) {
            Mouse.pressed.MOUSE_0 = false;
            if (Utils.pointInRectangle(Mouse.position, this.deck.position, DIMENSIONS.CARD.width, DIMENSIONS.CARD.height)) {
                if (this.deck.size() > 0) {
                    this.moveCards([this.deck.peek()], this.waste, [this.deck.peek()]);
                } else if (this.waste.size() > 0) {
                    var wasteCopy = this.waste.copy();
                    this.moveCards(wasteCopy, this.deck, null, wasteCopy);
                }
            }
            if (this.waste.size() > 0 && Utils.pointInRectangle(Mouse.position, this.waste.position, DIMENSIONS.CARD.width, DIMENSIONS.CARD.height)) {
                this.waste.peek().highlighted = true;
                this.chosenCards.push(this.waste.peek());
            }
            for (var i = this.pyramid.size(true); i >= 0; i--) {
                var card = this.pyramid.get(i);
                if (card != null && Utils.pointInRectangle(Mouse.position, card.position, DIMENSIONS.CARD.width, DIMENSIONS.CARD.height) && !this.pyramid.getChildren(card).length) {
                    card.highlighted = true;
                    if (this.chosenCards.indexOf(card) == -1)
                        this.chosenCards.push(card);
                    else{
                        this.chosenCards = [];
                        card.highlighted = false;
                    }
                    break;
                }
            }
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
        this.waste.position = new Vector2(6 * DIMENSIONS.STACK_OFFSET.width + DIMENSIONS.CARD.width * 5, DIMENSIONS.STACK_OFFSET.height);
        this.deck.position = new Vector2(7 * DIMENSIONS.STACK_OFFSET.width + DIMENSIONS.CARD.width * 6, DIMENSIONS.STACK_OFFSET.height);
        this.pyramid.position = new Vector2(Canvas.width / 2, DIMENSIONS.STACK_OFFSET.height);
    }

}