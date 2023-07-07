import {GameState} from "./game_state";
import {MenuControls} from "../views/controls/menu_controls";
import {Vector3} from "three";
import {Utils} from "../utils/utils";

export class GameMenu extends GameState {

    constructor(game, menu) {

        super(game);

        game.views.changeControls(new MenuControls(
            game.views.mainCamera, document.body, new Vector3(game.labyrinth.size, 0, game.labyrinth.size)
        ))

        this.light = game.views.addHemisphereLight();

        game.ui_score.updateScore(game.getScore())
        this.createMenu(menu)
        this.createBestTime()
    }

    dispose() {
        this.main_div.remove()
        this.div_time?.remove()
        this.light.parent.remove(this.light)
    }

    createMenu(menu) {

        const formMainDiv = () => {

            this.main_div = document.createElement('div')
            this.main_div.classList.add('main-menu')
            document.body.append(this.main_div);

            setTimeout(() => {
                this.main_div.classList.add('open')
            }, 600)
        }
        const formMenuDiv = (menu) => {

            let menu_div = document.createElement('div');
            menu_div.classList.add('menu');
            this.main_div.append(menu_div)

            menu.forEach(param => {
                let node_text = document.createElement('div')
                node_text.classList.add('menu-item')
                node_text.innerHTML = param.title
                if (param.action)
                    node_text.onmousedown = () => {
                        param.action()
                    }
                if (param.list) {
                    node_text.onmousedown = () => {
                        menu_div.innerHTML = ''
                        formMenuDiv(param.list)
                    }
                }
                menu_div.append(node_text)
            })

        }
        const formTitleDiv = () => {
            let title_div = document.createElement('div');
            title_div.classList.add('title');
            title_div.innerHTML = 'labyrinth logic'
            this.main_div.append(title_div)
        }

        formMainDiv();
        formMenuDiv(menu)
        formTitleDiv()

    }

    createBestTime() {

        let time = this.game.getBestTime()

        if (time) {

            this.div_time = document.createElement('div')
            this.div_time.classList.add('best-time');
            this.div_time.innerHTML = `Лучшее время: <br> ${Utils.getMinutes(time)}:${Utils.getSeconds(time)}`
            document.body.append(this.div_time)

            setTimeout(() => {
                this.div_time.classList.add('open')
            }, 600)
        }

    }

}