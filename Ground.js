function Ground(position) {
    this.list = [];
    this.size = 0;
    this.position = position;
    this.gap = 40;
}

Ground.prototype.push = function (item) {
    this.list.push(item);
    item.deck = this;
    item.position = new Vector2(this.position.x, this.position.y + this.size * this.gap);
    this.size++;
}

Ground.prototype.pop = function () {
    this.size--;
    item = this.list.pop();
    item.deck = null;
    return item;
}

Ground.prototype.peek = function () {
    return this.list[this.list.length - 1];
}

Ground.prototype.remove = function (item) {
    this.list.splice(this.list.indexOf(item), 1);
    this.size--;
}