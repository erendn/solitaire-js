function GameStack() {
    this.done = [];
    this.undone = [];
}

GameStack.prototype.push = function (node) {
    this.undone = [node];
    this.redo();
}

GameStack.prototype.undo = function () {
    if (this.done.length > 0) {
        var node = this.done.pop();
        this.undone.push(node);
        for (var i = node.cardsMoved.length - 1; i >= 0; i--) {
            var card = node.cardsMoved[i];
            card.release();
            if (Array.isArray(node.movedFrom)) {
                if (Array.isArray(node.movedFrom[i])) {
                    node.movedFrom[i][0].put(card, node.movedFrom[i][1]);
                } else {
                    node.movedFrom[i].push(card);
                }
            } else
                node.movedFrom.push(card);
            card.moving = false;
            card.highlighted = false;
        }
        node.cardsRevealed.forEach(element => element.revealed = false);
        node.cardsUnrevealed.forEach(element => element.revealed = true);
    }
}

GameStack.prototype.redo = function () {
    if (this.undone.length > 0) {
        var node = this.undone.pop();
        this.done.push(node);
        for (var i = node.cardsMoved.length - 1; i >= 0; i--) {
            var card = node.cardsMoved[i];
            card.release();
            if (Array.isArray(node.movedTo))
                node.movedTo[i].push(card);
            else
                node.movedTo.push(card);
            card.moving = false;
            card.highlighted = false;
        }
        node.cardsRevealed.forEach(element => element.revealed = true);
        node.cardsUnrevealed.forEach(element => element.revealed = false);
    }
}