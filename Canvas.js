function Canvas2D() {
  this._canvas = document.getElementById('screen');
  this._canvasContext = this._canvas.getContext('2d');
  this._canvas.width = window.innerWidth;
  this._canvas.height = window.innerHeight;
}

Canvas2D.prototype.clear = function () {
  this._canvasContext.clearRect(0, 0, this._canvas.width, this._canvas.height);
}

Canvas2D.prototype.drawImage = function (fileName, position) {
  image = new Image();
  image.src = "./assets/sprites/" + fileName + ".png";
  this._canvasContext.drawImage(image, position.x, position.y);
}

let Canvas = new Canvas2D();
