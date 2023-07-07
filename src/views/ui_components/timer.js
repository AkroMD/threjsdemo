export class TimerUI {

    constructor(object_scores) {

        this.div_hint = document.createElement('div')
        this.div_hint.classList.add('timer-score');
        document.body.append(this.div_hint)

        this.object_scores = object_scores
        this.updateScore()
        this.timer = setInterval(() => this.updateScore(), 1000)

    }

    dispose() {
        this.div_hint.remove()
        clearInterval(this.timer)
    }

    updateScore() {

        this.object_scores.timeTick();
        this.div_hint.innerHTML = `Время поиска: ${this.object_scores.TimeToString()}`

    }

}