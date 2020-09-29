function EventListener() {
    this.position = new Vector2(0, 0);
    this.offset = origin;
    this.clicked = false;
    this.pressed = {
        MOUSE_0: false,
        MOUSE_2: false,
        KEY_CTRL: false,
        KEY_H: false,
        KEY_Y: false,
        KEY_Z: false
    }
    this.carried = [];
    document.onmousemove = mouseMove;
    document.onclick = mouseClick;
    document.onmousedown = mouseDown;
    document.onmouseup = mouseUp;
    document.onkeydown = keyDown;
    document.onkeyup = keyUp;
}

const INPUTS = {
    MOUSE_0: 0,
    MOUSE_2: 2,
    KEY_CTRL: 17,
    KEY_H: 72,
    KEY_Y: 89,
    KEY_Z: 90
}

function mouseMove(event) {
    Mouse.position.x = event.pageX - Canvas.canvas.getBoundingClientRect().x;
    Mouse.position.y = event.pageY - Canvas.canvas.getBoundingClientRect().y;
}

function mouseClick(event) {
    if (event.button == INPUTS.MOUSE_0)
        Mouse.clicked = true;
}
function mouseDown(event) {
    var index = Object.values(INPUTS).indexOf(event.button);
    if (index >= 0)
        Mouse.pressed[Object.keys(INPUTS)[index]] = true;
}

function mouseUp(event) {
    var index = Object.values(INPUTS).indexOf(event.button);
    if (index >= 0)
        Mouse.pressed[Object.keys(INPUTS)[index]] = false;
}

function keyDown(event) {
    var index = Object.values(INPUTS).indexOf(event.which);
    if (index >= 0)
        Mouse.pressed[Object.keys(INPUTS)[index]] = true;
}

function keyUp(event) {
    var index = Object.values(INPUTS).indexOf(event.which);
    if (index >= 0)
        Mouse.pressed[Object.keys(INPUTS)[index]] = false;
}

let Mouse = new EventListener();