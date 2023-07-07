export class HintOpen {

    constructor() {

        this.div_hint = document.createElement('div')
        this.div_hint.classList.add('hint-open');
        this.div_hint.innerHTML = `Нажмите F`
        document.body.append(this.div_hint)

    }

    dispose() {
        this.div_hint.remove()
    }

}