const COLORS = {
    BACKGROUND: {
        LIGHT_GREEN: '#03ad31',
        DARK_GREEN: '#026b1e',
        DARKER_GREEN: '#004011',
        LIGHT_GRAY: '#cccccc',
        BLACK: '#000000',
    },
    CARD: {
        BLACK: 'black',
        WHITE: 'white'
    }
}

let SETTINGS = {
    BACKGROUND_COLOR: 'DARK_GREEN'
}

// If 'loading' is less than 'maxLoading', the game has not been loaded yet
var loading = 0;
var maxLoading = 0;

let SPRITES = {}
let FONTS = {}

function loadAssets() {
    // Loading sound samples

    // Loading sprites
    SPRITES['card-back'] = loadSprite('card-back');
    SPRITES['frame'] = loadSprite('frame');
    SPRITES['frame-empty'] = loadSprite('frame-empty');
    SPRITES['highlight'] = loadSprite('highlight');
    for (suit in SUITS) {
        for (var i = 1; i <= 13; i++) {
            SPRITES[`${suit}-${i}`] = loadSprite(`${suit.toLowerCase()}-${i}`);
        }
    }

}

function loadSprite(fileName) {
    maxLoading++;
    var sprite = new Image();
    sprite.onload = function () {
        loading++;
    }
    sprite.src = `./src/assets/sprites/${fileName}.png`
    return sprite;
}