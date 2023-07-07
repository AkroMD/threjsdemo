import {GameState} from "./game_state";

export class GameController {


    state = new GameState()

    dispose() {

    }

    changeState(game_state) {
        this.state.dispose()
        this.state = game_state
    }

}