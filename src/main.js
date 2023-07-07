import {GameView} from "./views/game_view";
import {Game} from "./game";


let views_node = document.createElement('div');
views_node.classList.add('game-canvas')
document.body.append(views_node)

let canvas = document.createElement('canvas')
views_node.append(canvas);

let game_view = new GameView(canvas)
game_view.update()

new Game(game_view)
