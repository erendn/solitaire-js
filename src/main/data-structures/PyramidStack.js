function PyramidStack() {
    this.list = [];
    this.position = undefined;
    this.stacked = false;
    this.groundMark = null;
}

/*          Visualization of a PyramidStack

                  index             level
                    0         ---     0
                   / \
                  1   2       ---     1
                 / \ / \
                3   4   5     ---     2
               / \ / \ / \
              6   7   8   9   ---     3

*/

PyramidStack.prototype.push = function (element) {
    element.stack = this;
    var found = false;
    for (var i = 0; i < this.list.length; i++) {
        found = this.list[i] == null;
        if (found) {
            this.list[i] = element;
            break;
        }
    }
    if (!found) {
        this.list.push(element);
    }
}

PyramidStack.prototype.remove = function (element) {
    for (var i = 0; i < this.list.length; i++) {
        if (this.list[i] == element) {
            this.list.splice(i, 1, null);
            element.stack = null;
        }
    }
}

PyramidStack.prototype.put = function (element, index) {
    element.stack = this;
    this.list[index] = element;
}

PyramidStack.prototype.size = function (all = false) {
    if (all)
        return this.list.length;
    var count = 0;
    for (var i = 0; i < this.list.length; i++)
        if (this.list[i] != null)
            ++count;
    return count;
}

PyramidStack.prototype.get = function (index) {
    return this.list[index];
}

PyramidStack.prototype.indexAndLevelOf = function (element) {
    var level = 0;
    var index = 0;
    for (var lastLevel = 0, lastLevelIndex = 0; index < this.list.length; index++) {
        if (level <= lastLevel && index > lastLevelIndex)
            ++level;
        if (this.list[index] == element)
            break;
        if (lastLevelIndex + lastLevel + 2 == index) {
            ++lastLevel;
            lastLevelIndex = index;
        }
    }
    return { index: index, level: level };
}

PyramidStack.prototype.getChildren = function (parent) {
    var index_level = this.indexAndLevelOf(parent);
    var children = [this.list[index_level.index + index_level.level + 1], this.list[index_level.index + index_level.level + 2]];
    return children.filter(element => element != undefined);
}

PyramidStack.prototype.some = function (func) {
    return this.list.some(func);
}