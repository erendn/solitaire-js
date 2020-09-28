const COLORS = {
    BACKGROUND: {
        DARK_GREEN: '#026b1e',
        DARKER_GREEN: '#004011'
    },
    CARD: {
        BLACK: 'black',
        WHITE: 'white'
    }
}

let SETTINGS = {
    BACKGROUND_COLOR: 'DARK_GREEN'
}

var loading = 0;
var maxLoading = 0;

let SPRITES = {}
let FONTS = {}

function loadAssets() {
    // LOADING SAMPLES

    // LOADING SPRITES
    SPRITES['card-back'] = loadSprite('card-back');
    SPRITES['frame'] = loadSprite('frame');
    SPRITES['frame-empty'] = loadSprite('frame-empty');
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