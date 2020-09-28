function Canvas2D() {
    this.canvas = document.getElementById('screen');
    this.canvasContext = this.canvas.getContext('2d');
    this.resize();
}

Canvas2D.prototype.resize = function () {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
}

Canvas2D.prototype.clear = function () {
    this.canvasContext.clearRect(0, 0, this.width, this.height);
}

Canvas2D.prototype.fill = function (color) {
    this.canvasContext.fillStyle = color;
    this.canvasContext.globalAlpha = 1;
    this.canvasContext.fillRect(0, 0, this.width, this.height);
}

Canvas2D.prototype.drawImage = function (image, topLeft, width, height) {
    this.globalAlpha = 1;
    this.canvasContext.drawImage(image, topLeft.x, topLeft.y, width, height);
}

Canvas2D.prototype.drawRect = function (topLeft, width, height, color, alpha = 1) {
    this.canvasContext.fillStyle = color;
    this.canvasContext.globalAlpha = alpha;
    this.canvasContext.fillRect(topLeft.x, topLeft.y, width, height);
}

let Canvas = new Canvas2D();