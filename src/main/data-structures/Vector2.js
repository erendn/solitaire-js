function Vector2(x, y) {
    this.x = x;
    this.y = y;
}

Vector2.diff = function (terminal, destination) {
    return new Vector2(terminal.x - destination.x, terminal.y - destination.y);
}