function Game() {
    this.scene = SCENES.IN_GAME;
}

const SCENES = {
    MENU: 'menu-scene',
    SETTINGS: 'settings',
    IN_GAME: 'in-game'
}

const GAMES = {
    KLONDIKE: 'klondike',
    FREECELL: 'freecell',
    SPIDER: 'spider',
    PYRAMID: 'pyramid'
}

const FPS = 60;

var time = null;
var currentTime = null;

Game.prototype.start = function () {
    Solitaire.init();
    Solitaire.newGame(GAMES.KLONDIKE);
    Solitaire.mainLoop();
}

Game.prototype.init = function () {
    time = new Date().getTime();
    loadAssets();
    Dimension.calculateAll();
}

Game.prototype.newGame = function (type) {
    if (type == GAMES.KLONDIKE) {
        Solitaire.gameWorld = new Klondike();
    } else if (type == GAMES.FREECELL) {

    }
}

Game.prototype.mainLoop = function () {
    currentTime = new Date().getTime();
    var milliseconds = currentTime - time;
    if (milliseconds >= 1000 / FPS) {
        time = currentTime;
        if (loading < maxLoading) {

        } else {
            if (Solitaire.scene == SCENES.IN_GAME) {
                Solitaire.gameWorld.play();
                Solitaire.gameWorld.update();
                Solitaire.gameWorld.render();
            }
        }
    }

    requestAnimationFrame(Solitaire.mainLoop);
}

let Solitaire = new Game();