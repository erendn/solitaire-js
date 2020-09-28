function GameStack() {
    this.done = [];
    this.undone = [];
}

GameStack.prototype.push = function (node) {
    this.undone = [node];
    this.redo();
}

GameStack.prototype.undo = function () {
    var node = this.done.pop();
    this.undone.push(node);

}

GameStack.prototype.redo = function () {
    var node = this.undone.pop();
    this.done.push(node);
    while (node.cardsMoved.length > 0) {
        var card = node.cardsMoved.pop();
        card.release();
        node.movedTo.push(card);
        card.moving = false;
    }
    node.cardsRevealed.forEach(element => element.revealed = true);
    node.cardsUnrevealed.forEach(element => element.revealed = false);
}