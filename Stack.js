function Stack(position) {
    this.list = [];
    this.size = 0;
    this.position = position;
}

Stack.prototype.push = function (item) {
    this.list.push(item);
    item.deck = this;
    item.position = this.position;
    this.size++;
}

Stack.prototype.pop = function () {
    this.size--;
    item = this.list.pop();
    item.deck = null;
    return item;
}

Stack.prototype.peek = function () {
    if (this.list.length > 0)
        return this.list[this.list.length - 1];
    else
        return null;
}

Stack.prototype.remove = function (item) {
    this.list.splice(this.list.indexOf(item), 1);
    this.size--;
}

Stack.prototype.shuffle = function () {
    mixed = [];
    while (this.list.length > 0) {
        index = Math.floor(Math.random() * this.list.length);
        mixed.push(this.list[index]);
        this.list.splice(index, 1);
    }
    this.list = mixed;
}