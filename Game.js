function Game() {

}

Game.prototype.init = function () {
  this.gameWorld = new GameWorld();
}

Game.prototype.start = function () {
  CardGame.init();
  CardGame.mainLoop();
}

Game.prototype.mainLoop = function () {
  Canvas.clear();
  CardGame.gameWorld.update();
  CardGame.gameWorld.draw();
  Mouse.reset();

  requestAnimationFrame(CardGame.mainLoop);
}

let CardGame = new Game();
