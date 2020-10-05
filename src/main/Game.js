function Game() {
    this.scene = SCENES.MENU;
    this.menuButtons = ["Klondike", "Spider", "Freecell", "Pyramid"];
}

const SCENES = {
    LOADING: 'loading',
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
            Solitaire.render(SCENES.LOADING);
        } else {
            if (Solitaire.scene == SCENES.MENU) {
                Solitaire.render(SCENES.MENU);
            } else if (Solitaire.scene == SCENES.IN_GAME) {
                Solitaire.gameWorld.play();
                Solitaire.gameWorld.update();
                Solitaire.gameWorld.render();
            }
        }
    }
    requestAnimationFrame(Solitaire.mainLoop);
}

Game.prototype.render = function (scene) {
    if (scene == SCENES.LOADING) {
        Canvas.fill(COLORS.BACKGROUND.DARK_GREEN);
        Canvas.drawText("Loading", new Vector2(Canvas.width / 2, Canvas.height / 2), Canvas.width / 15, COLORS.BACKGROUND.LIGHT_GRAY, TEXT_ALIGN.VERTICAL.CENTER, TEXT_ALIGN.HORIZONTAL.BOTTOM);
        Canvas.drawRect(new Vector2(Canvas.width / 3, Canvas.height * 0.55), Canvas.width / 3, Canvas.height / 15, COLORS.BACKGROUND.BLACK);
        Canvas.drawRect(new Vector2(Canvas.width / 3, Canvas.height * 0.55), (loading / maxLoading) * Canvas.width / 3, Canvas.height / 15, COLORS.BACKGROUND.LIGHT_GREEN);
    } else if (scene == SCENES.MENU) {
        Canvas.fill(COLORS.BACKGROUND.DARK_GREEN);
        Canvas.drawText("Solitaire", new Vector2(Canvas.width / 2, Canvas.height / 4), Canvas.width / 8, COLORS.BACKGROUND.LIGHT_GRAY);
        var totalButtonWidth = 0;
        var pixelSize = Canvas.width / 15;
        Solitaire.menuButtons.forEach(element => totalButtonWidth += Canvas.textWidth(element, pixelSize));
        var position = new Vector2(0, Canvas.height / 2);
        var diffWidth = (Canvas.width - totalButtonWidth) / (Solitaire.menuButtons.length + 1);
        var clickedButton = null;
        for (var i = 0; i < Solitaire.menuButtons.length; i++) {
            position.x += diffWidth;
            var width = Canvas.textWidth(Solitaire.menuButtons[i], pixelSize);
            var hovered = Utils.pointInRectangle(Mouse.position, position, width, pixelSize);
            Canvas.drawRect(position, width, pixelSize, hovered ? COLORS.BACKGROUND.LIGHT_GREEN : COLORS.BACKGROUND.DARKER_GREEN);
            Canvas.drawText(Solitaire.menuButtons[i], new Vector2(position.x + width / 2, position.y + pixelSize / 2), pixelSize - 10, hovered && Mouse.pressed.MOUSE_0 ? COLORS.BACKGROUND.BLACK : COLORS.BACKGROUND.LIGHT_GRAY);
            if (hovered && Mouse.pressed.MOUSE_0)
                clickedButton = Solitaire.menuButtons[i].toLowerCase();
            position.x += width;
        }
        if (clickedButton != null) {
            Solitaire.newGame(clickedButton);
            Solitaire.scene = SCENES.IN_GAME;
        }
    }
}

let Solitaire = new Game();