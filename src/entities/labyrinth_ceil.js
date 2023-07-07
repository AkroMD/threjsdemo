export class LabyrinthCeil {

    content = null
    x = 0;
    y = 0;

    constructor({content, walls}) {
        Object.assign(this, arguments[0])
    }

    openTreasure() {
        this.content = null
    }

    hasTreasure() {
        return !!this.content
    }

}