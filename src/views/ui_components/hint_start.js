export class HintStart {

    constructor() {

        this.div_hint = document.createElement('div')
        this.div_hint.classList.add('hint-start');
        this.div_hint.innerHTML = `Отыщите все сокровища и разграбьте их! <br> Караваны будут в следующей серии...`
        document.body.append(this.div_hint)

        setTimeout(() => this.dispose(), 5000)

    }

    dispose() {
        this.div_hint.remove()
    }

}