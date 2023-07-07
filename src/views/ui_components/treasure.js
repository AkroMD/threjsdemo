export class TreasureUI {

    constructor(value) {

        this.div_hint = document.createElement('div')
        this.div_hint.classList.add('treasure-score');
        this.updateScore(value)
        document.body.append(this.div_hint)

        setTimeout(() => {
            this.div_hint.classList.add('open')
        }, 600)

    }

    dispose() {
        this.div_hint.remove()
    }

    updateScore(value) {
        let end_text = value === 1 ? 'e' :
            [2, 3, 4].includes(value) ? 'а' : ''
        this.div_hint.innerHTML = `Уверен здесь еще ${value} сокровищ${end_text}`
    }

}