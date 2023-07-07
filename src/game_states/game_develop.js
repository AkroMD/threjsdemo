import {GameState} from "./game_state";
import {DevelopControls} from "../views/controls/develop_controls";
import {Vector3} from "three";

export class GameDevelop extends GameState {

    constructor(game) {

        super(game);

        let controls = new DevelopControls(
            game.views.mainCamera, game.views.renderer.domElement
        )

        let position_center = new Vector3(game.labyrinth.size * game.size_ceil * 0.5, 0, game.labyrinth.size * game.size_ceil * 0.5)

        this.light = game.views.addHemisphereLight();

        game.views.changeControls(controls)
        controls.lockAt(position_center)

        this.onkeyup = (event) => this.keyup(event)
        document.addEventListener('keyup', this.onkeyup)

    }

    keyup(event) {
        if (event.code === 'Escape')
            this.game.toMenu()
    }


    dispose() {
        this.light.parent.remove(this.light)
        document.removeEventListener('keyup', this.onkeyup)
    }

}