class GameWorld {

    constructor() {
        this.stackOnGround = [];
        this.gameStack = new GameStack();
        this.movesAvailable = [];
        this.showHint = null;
        this.gameOver = false;
    }

    /**
     * Performs game generation algorithm. This function guarantees a game with at least one valid solution.
     */
    generate() {
        throw new Error(ERROR_MESSAGE);
    }

    /**
     * Performs user interactions.
     */
    play() {
        throw new Error(ERROR_MESSAGE);
    }

    /**
     * Updates the GameWorld after user interactions.
     */
    update() {
        throw new Error(ERROR_MESSAGE);
    }

    /**
     * Renders the GameWorld after it is updated.
     */
    render() {
        Canvas.fill(COLORS.BACKGROUND[SETTINGS.BACKGROUND_COLOR]);
        // Rendering the stacks that are on the ground.
        for (var i = 0; i < this.stackOnGround.length; i++) {
            if (this.stackOnGround[i].groundMark != null) {
                Canvas.drawImage(SPRITES[this.stackOnGround[i].groundMark], this.stackOnGround[i].position, DIMENSIONS.CARD.width, DIMENSIONS.CARD.height);
            }
            var position = { ...this.stackOnGround[i].position };
            for (var j = 0; j < this.stackOnGround[i].size(); j++) {
                var card = this.stackOnGround[i].get(j);
                if (!card.moving) {
                    card.position = { ...position };
                    Canvas.drawImage(SPRITES[card.getSpriteName()], card.position, DIMENSIONS.CARD.width, DIMENSIONS.CARD.height);
                }
                if (!this.stackOnGround[i].stacked)
                    position.y += card.revealed ? 200 / (3.5 * (this.stackOnGround[i].size() / 14 + 1)) : DIMENSIONS.CARD_OFFSET.height;
            }
        }
        // Rendering the cards that are carried by the player.
        var position = new Vector2(Mouse.position.x - Mouse.offset.x, Mouse.position.y - Mouse.offset.y);
        for (var i = 0; i < Mouse.carried.length; i++) {
            Canvas.drawImage(SPRITES[Mouse.carried[i].getSpriteName()], position, DIMENSIONS.CARD.width, DIMENSIONS.CARD.height);
            position.y += i == 0 ? 50 : 10;
        }
        // Rendering the ghost cards that show hint.
        if (this.showHint != null) {
            var hint = this.movesAvailable[this.showHint.index];
            var position = Vector2.moveTowards(hint.terminal, hint.destination, this.showHint.step);
            this.showHint.step = (this.showHint.step + 0.01) % 1;
            for (var i = 0; i < hint.cards.length; i++) {
                Canvas.drawImage(SPRITES[hint.cards[i].getSpriteName()], position, DIMENSIONS.CARD.width, DIMENSIONS.CARD.height, 0.6);
                position.y += 200 / (4 * (hint.cards[i].stack.size() / 14 + 1));
            }
        }
        // Rendering end game screen
        if (this.gameOver) {
            var textHeight = Canvas.height * 0.2;
            Canvas.drawRect(new Vector2(0, (Canvas.height - textHeight) / 2 - 5), Canvas.width, textHeight + 10, COLORS.BACKGROUND.DARKER_GREEN, 0.7);
            Canvas.drawText("Solved", new Vector2(Canvas.width / 2, Canvas.height / 2), textHeight, COLORS.BACKGROUND.LIGHT_GRAY);
        }
    }

    /**
     * Creates a GameNode for the cards moved and pushes it into GameStack. Also deletes the 'showHint' attribute of the GameWorld.
     * @param {Array.<Card>} cards 
     * @param {Stack} destination 
     * @param {Array.<Card>} reveal 
     * @param {Array.<Card>} unreveal 
     */
    moveCards(cards, destination, reveal = null, unreveal = null) {
        var move = new GameNode();
        move.cardsMoved = cards;
        move.movedFrom = cards[0].stack;
        move.movedTo = destination;
        if (reveal != null)
            move.cardsRevealed = reveal;
        else if (move.movedFrom.size() > cards.length && !move.movedFrom.get(move.movedFrom.size() - cards.length - 1).revealed)
            move.cardsRevealed = [move.movedFrom.get(move.movedFrom.size() - cards.length - 1)];
        if (unreveal != null)
            move.cardsUnrevealed = unreveal;
        this.gameStack.push(move);
        this.showHint = null;
    }

    /**
     * Returns all available moves in the game.
     */
    getHints() {
        throw new Error(ERROR_MESSAGE);
    }

    /**
     * Returns the stacks that the given card can be moved to.
     * @param {Card} card 
     * @param {boolean} stacked 
     * 
     * @return {Array.<Stack>}
     */
    getAvailableMoves(card, stacked = false) {
        throw new Error(ERROR_MESSAGE);
    }

    /**
     * Returns whether the given card can be moved to the given stack.
     * @param {Card} card 
     * @param {Stack} targetStack 
     * 
     * @return {boolean}
     */
    isValidMove(card, targetStack) {
        throw new Error(ERROR_MESSAGE);
    }

}

const ERROR_MESSAGE = "GameWorld is an abstract class. All abstract methods must be implemented in the class that inherits from GameWorld.";