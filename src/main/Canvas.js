function Canvas2D() {
    this.canvas = document.getElementById('screen');
    this.canvasContext = this.canvas.getContext('2d');
    this.resize();
}

const TEXT_ALIGN = {
    VERTICAL: {
        LEFT: 'left',
        RIGHT: 'right',
        CENTER: 'center'
    },
    HORIZONTAL: {
        TOP: 'top',
        BOTTOM: 'bottom',
        CENTER: 'middle'
    }
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
    this.canvasContext.fillRect(0, 0, this.width, this.height);
}

Canvas2D.prototype.drawImage = function (image, topLeft, width, height, alpha = 1) {
    this.canvasContext.globalAlpha = alpha;
    this.canvasContext.drawImage(image, topLeft.x, topLeft.y, width, height);
    this.canvasContext.globalAlpha = 1;
}

Canvas2D.prototype.drawRect = function (topLeft, width, height, color, alpha = 1) {
    this.canvasContext.fillStyle = color;
    this.canvasContext.globalAlpha = alpha;
    this.canvasContext.fillRect(topLeft.x, topLeft.y, width, height);
    this.canvasContext.globalAlpha = 1;
}

Canvas2D.prototype.drawText = function (text, anchor, pixelSize, color, verticalAlign = 'center', horizontalAlign = 'middle') {
    this.canvasContext.font = `${pixelSize}px Coolvetica`;
    this.canvasContext.fillStyle = color;
    this.canvasContext.textAlign = verticalAlign;
    this.canvasContext.textBaseline = horizontalAlign;
    this.canvasContext.fillText(text, anchor.x, anchor.y);
}

Canvas2D.prototype.textWidth = function (text, pixelSize) {
    this.canvasContext.font = `${pixelSize}px Coolvetica`;
    return this.canvasContext.measureText(text).width;
}

let Canvas = new Canvas2D();