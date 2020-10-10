function Dimension(width, height) {
    this.width = width;
    this.height = height;
}

let DIMENSIONS = {}

const cardRatio = 0.72;

Dimension.calculateAll = function (gameType = null) {
    Canvas.resize();
    if (Canvas.height / Canvas.width <= cardRatio) {
        var height = Canvas.height / 5;
        DIMENSIONS.CARD = new Dimension(height * cardRatio, height);
    } else {
        var width = Canvas.width / 9.5;
        DIMENSIONS.CARD = new Dimension(width, width / cardRatio);
    }
    DIMENSIONS.CARD_OFFSET = new Dimension(DIMENSIONS.CARD.height / 10, DIMENSIONS.CARD.height / 10);
    if (gameType == GAMES.KLONDIKE) {
        DIMENSIONS.STACK_OFFSET = new Dimension((Canvas.width - DIMENSIONS.CARD.width * 7) / 8, DIMENSIONS.CARD.width / 3);
    } else if (gameType == GAMES.SPIDER) {
        DIMENSIONS.STACK_OFFSET = new Dimension((Canvas.width - DIMENSIONS.CARD.width * 10) / 11, DIMENSIONS.CARD.width / 3);
    } else if (gameType == GAMES.FREECELL) {
        DIMENSIONS.STACK_OFFSET = new Dimension((Canvas.width - DIMENSIONS.CARD.width * 8) / 9, DIMENSIONS.CARD.width / 3);
    } else if (gameType == GAMES.PYRAMID) {
        DIMENSIONS.STACK_OFFSET = new Dimension((Canvas.width - DIMENSIONS.CARD.width * 7) / 8, DIMENSIONS.CARD.width / 3);
    }
}