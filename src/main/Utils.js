function Utils() { }

const origin = new Vector2(0, 0);

/**
 * Returns a randomly shuffled version of the given array. This is a non-destructive function.
 * @param {*} array The array to be shuffled.
 */
Utils.shuffle = function (array) {
    orig = array.slice();
    shuf = [];
    while (orig.length > 0)
        shuf.push(orig.splice(Math.floor(Math.random() * orig.length), 1)[0]);
    return shuf;
}

Utils.pointInRectangle = function (point1, point2, width, height) {
    return point1.x <= point2.x + width && point1.x >= point2.x && point1.y <= point2.y + height && point1.y >= point2.y;
}