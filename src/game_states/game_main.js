import {GameState} from "./game_state";
import {GameControls} from "../views/controls/game_controls";
import {Vector3} from "three";
import {HintOpen} from "../views/ui_components/hint_open";
import {TreasureUI} from "../views/ui_components/treasure";
import {TimerUI} from "../views/ui_components/timer";

export class GameMain extends GameState {

    constructor(game, position) {

        super(game);

        let controls = new GameControls(
            game.views.getCamera(), document.body, game.views.scene
        )
        controls.setCollisionObjects(game.collision_objects)
        controls.setActions({
            'KeyF': () => this.openTreasure(),
        })
        controls.setUpdateFunction(() => this.checkTreasure())
        controls.setEscapeFunction(() => this.game.pauseGame())
        game.views.changeControls(controls)
        game.views.setPositionCamera(position)

        this.ui_treasure = new TreasureUI(game.countTreasure())
        this.ui_timer = new TimerUI(this.game.getScores());
    }

    dispose() {
        this.ui_hint?.dispose()
        this.ui_treasure.dispose()
        this.ui_timer.dispose()
    }

    openTreasure() {

        if (this.treasure_position) {

            this.game.openTreasure(this.treasure_position.x, this.treasure_position.z)
            this.ui_treasure.updateScore(this.game.countTreasure())

            this.endGame()
        }

    }

    checkTreasure() {

        let position = this.game.getPersonPosition()

        if (this.game.checkTreasure(position.x, position.z)) {

            if (!this.ui_hint) {

                this.ui_hint = new HintOpen()
                this.treasure_position = position

            }

        } else if (this.ui_hint) {

            this.ui_hint.dispose()
            delete this.ui_hint
            delete this.treasure_position

        }

    }

    endGame() {

        if (this.game.countTreasure() === 0) {
            this.game.endGame()
        }

    }

}