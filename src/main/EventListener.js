function EventListener() {
    this.position = new Vector2(0, 0);
    this.offset = origin;
    this.clicked = false;
    this.ctrlClicked = false;
    this.pressed = false;
    this.carried = [];
    document.onmousemove = mouseMove;
    document.onclick = mouseClick;
    document.ondblclick = mouseDoubleClick;
    document.onmousedown = mouseDown;
    document.onmouseup = mouseUp;
}

function mouseMove(event) {
    Mouse.position.x = event.pageX - Canvas.canvas.getBoundingClientRect().x;
    Mouse.position.y = event.pageY - Canvas.canvas.getBoundingClientRect().y;
}

function mouseClick(event) {
    if (event.button == 0)
        if (event.ctrKey)
            Mouse.ctrlClicked = true;
        else
            Mouse.clicked = true;
}

function mouseDoubleClick(event) {
    if (event.button == 0)
        Mouse.doubleClicked = true;
}

function mouseDown(event) {
    if (event.button == 0)
        Mouse.pressed = true;
}

function mouseUp(event) {
    if (event.button == 0)
        Mouse.pressed = false;
}

let Mouse = new EventListener();