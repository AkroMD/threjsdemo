import {GameState} from "./game_state";
import {MenuControls} from "../views/controls/menu_controls";
import {Vector3} from "three";

export class GameWin extends GameState {

    constructor(game) {

        super(game);

        game.views.changeControls(new MenuControls(
            game.views.getCamera(), document.body, new Vector3(game.labyrinth.size, 0, game.labyrinth.size)
        ))

        this.light = game.views.addHemisphereLight();

        document.body.addEventListener('click', () => {
            this.game.toMenu()
        }, {once: true})

        this.createText()
    }

    dispose() {
        this.main_div.remove()
        this.light.parent.remove(this.light)
    }

    createText() {

        this.main_div = document.createElement('div');
        this.main_div.classList.add('win-title');
        this.main_div.innerHTML = `Лабиринт разграблен! <br> 
                Время поиска: ${this.game.scores.TimeToString()}`
        document.body.append(this.main_div)

        setTimeout(() => {
            this.main_div.classList.add('open')
        }, 600)


    }


}