export class ScoreUI {

    constructor(value) {

        this.div_score = document.createElement('div')
        this.div_score.classList.add('score');
        this.updateScore(value)
        this.div_score.innerHTML = `Сундуков разграблено: <br> ${value}`
        document.body.append(this.div_score)

        setTimeout(() => {
            this.div_score.classList.add('open')
        }, 600)

    }

    dispose() {
        this.div_score.remove()
    }

    updateScore(value) {
        this.div_score.innerHTML = `Сундуков разграблено: <br> ${value}`
    }

}