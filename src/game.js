import {ScoreUI} from "./views/ui_components/score";
import {Labyrinth} from "./entities/labyrinth";
import {GenerateMesh} from "./meshes/generateMesh";
import {GameMain} from "./game_states/game_main";
import {GameMenu} from "./game_states/game_menu";
import {Vector3} from "three";
import {GameDevelop} from "./game_states/game_develop";
import {GameController} from "./game_states/game_controller";
import {HintStart} from "./views/ui_components/hint_start";
import {Api} from "./api/api";
import {ObjectScores} from "./entities/object_scores";
import {GameWin} from "./game_states/game_win";

const size_ceil = 2;

export class Game {

    scores = new ObjectScores()
    size_ceil = size_ceil;
    ui_score = new ScoreUI(0)
    labyrinth = new Labyrinth(10);
    three_meshes = new GenerateMesh(size_ceil);
    game_controller = new GameController()
    api = new Api()

    main_menu = [
        {
            title: 'Начать',
            list: [
                {
                    title: 'Легкий',
                    action: () => this.startGame(10)
                },
                {
                    title: 'Средний',
                    action: () => this.startGame(20)
                },
                {
                    title: 'Невозможный',
                    action: () => this.startGame(30)
                }
            ],
        },
        {
            title: 'Обзор',
            action: () => this.toDevelop(),
        },
    ]
    pause_menu = [
        {
            title: 'Продолжить',
            action: () => this.resumeGame()
        },
        {
            title: 'Завершить набег',
            action: () => this.toMenu(),
        },
    ]

    constructor(views) {

        this.views = views
        this.scores.addScore(this.loadScores()?.score || 0)
        this.generateLabyrinth(10)

        this.toMenu()
    }

    generateLabyrinth(size) {

        this.views.clear()
        this.labyrinth = new Labyrinth(size)
        let {group, collision_objects, treasure_objects} = this.three_meshes.createLabyrinth(this.labyrinth);
        this.collision_objects = collision_objects
        this.treasure_objects = treasure_objects

        this.views.addMesh(group)

    }

    startGame(size) {

        this.generateLabyrinth(size)
        this.scores.resetTime();
        this.game_controller.changeState(new GameMain(this, new Vector3(0, 1.5, 0)))
        new HintStart()
    }

    endGame() {
        this.saveScore()
        this.toWinMenu();
    }

    pauseGame() {
        this.save_position = this.views.getCamera().position.clone()
        this.game_controller.changeState(
            new GameMenu(
                this,
                this.pause_menu
            ))
    }

    resumeGame() {
        this.game_controller.changeState(new GameMain(this, this.save_position))
    }

    toMenu() {
        this.game_controller.changeState(
            new GameMenu(
                this,
                this.main_menu,
            ))
    }

    toWinMenu() {
        this.game_controller.changeState(
            new GameWin(this)
        )
    }

    toDevelop() {
        this.game_controller.changeState(
            new GameDevelop(this)
        )
    }

    getScore() {
        return this.getScores().score;
    }

    getBestTime() {
        let old_scores = this.loadScores();
        return old_scores?.time
    }

    getScores() {
        return this.scores
    }

    loadScores() {
        return JSON.parse(this.api.getScores())
    }

    saveScore() {

        let old_scores = this.loadScores();
        let save_score = {
            score: Math.max(old_scores?.score || 0, this.scores.score),
            time: old_scores?.time ? Math.min(old_scores.time, this.scores.time) : this.scores.time,
        }
        this.api.saveScores(save_score)

    }

    getPersonPosition() {
        return this.views.getCamera().position
            .clone()
            .divideScalar(this.size_ceil)
            .add(new Vector3(0.5, 0, 0.5))
            .floor()
    }

    countTreasure() {
        return this.labyrinth.count_treasure
    }

    openTreasure(x, y) {

        let key = this.labyrinth.getKeyCeil(x, y);
        let mesh = this.treasure_objects[key];
        mesh.parent.remove(mesh);

        this.labyrinth.getCeil(x, y).openTreasure()
        this.labyrinth.count_treasure--
        this.scores.addScore(1)

        this.ui_score.updateScore(this.scores.score)
    }

    checkTreasure(x, y) {
        return this.labyrinth.getCeil(x, y).hasTreasure()
    }

}