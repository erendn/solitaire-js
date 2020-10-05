function Stack(position) {
    this.list = [];
    this.position = position;
}

Stack.prototype.openDeck = function () {
    for (suit in SUITS) {
        for (var i = 1; i <= 13; i++) {
            this.push(new Card(suit, i));
        }
    }
}

Stack.prototype.pop = function () {
    var element = this.list.pop();
    element.stack = null;
    return element;
}

Stack.prototype.push = function (element) {
    element.stack = this;
    this.list.push(element);
}

Stack.prototype.peek = function () {
    return this.list[this.list.length - 1];
}

Stack.prototype.get = function (index) {
    return this.list[index];
}

Stack.prototype.take = function (index) {
    var element = this.list.splice(index, 1)[0];
    element.stack = null;
    return element;
}

Stack.prototype.remove = function (element) {
    for (var i = 0; i < this.list.length; i++) {
        if (element == this.list[i]) {
            this.list.splice(i, 1);
            element.stack = null;
            break;
        }
    }
}

Stack.prototype.shuffle = function () {
    this.list = Utils.shuffle(this.list);
}

Stack.prototype.size = function () {
    return this.list.length;
}

Stack.prototype.forEach = function (func) {
    this.list.forEach(func);
}

Stack.prototype.some = function (func) {
    return this.list.some(func);
}

Stack.prototype.copy = function () {
    return this.list.slice();
}