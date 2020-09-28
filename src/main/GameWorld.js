class GameWorld {

    play() {
        throw new Error(ERROR_MESSAGE);
    }

    update() {
        throw new Error(ERROR_MESSAGE);
    }

    render() {
        throw new Error(ERROR_MESSAGE);
    }

}

const ERROR_MESSAGE = "GameWorld is an abstract class. All inherited methods must be implemented in the class that inherits from GameWorld.";