function Vector2(x, y) {
    this.x = x;
    this.y = y;
}

Vector2.diff = function (terminal, destination) {
    return new Vector2(terminal.x - destination.x, terminal.y - destination.y);
}

Vector2.add = function (vec1, vec2) {
    return new Vector2(vec1.x + vec2.x, vec1.y + vec2.y);
}