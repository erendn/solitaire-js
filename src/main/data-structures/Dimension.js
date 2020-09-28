function Dimension(width, height) {
    this.width = width;
    this.height = height;
}

let DIMENSIONS = {}

const cardRatio = 0.72;

Dimension.calculateAll = function () {
    Canvas.resize();
    DIMENSIONS.TOPBAR = new Dimension(Canvas.width, Canvas.height / 13);
    if (Canvas.height / Canvas.width <= cardRatio) {
        var height = Canvas.height / 5;
        DIMENSIONS.CARD = new Dimension(height * cardRatio, height);
    } else {
        var width = Canvas.width / 9.5;
        DIMENSIONS.CARD = new Dimension(width, width / cardRatio);
    }
    DIMENSIONS.STACK_OFFSET = new Dimension((Canvas.width - DIMENSIONS.CARD.width * 7) / 8, DIMENSIONS.CARD.width / 3);
    DIMENSIONS.CARD_OFFSET = new Dimension(DIMENSIONS.CARD.height / 10, DIMENSIONS.CARD.height / 4);
}