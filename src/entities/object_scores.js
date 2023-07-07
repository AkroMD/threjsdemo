import {Utils} from "../utils/utils";

export class ObjectScores {

    time = 0;
    score = 0;

    constructor() {
        Object.assign(this, arguments[0])
    }

    timeTick() {
        this.time++
    }

    addScore(value) {
        this.score += value
    }

    resetTime() {
        this.time = 0
    }

    TimeToString() {

        let minute = Utils.getMinutes(this.time)
        let seconds = Utils.getSeconds(this.time)

        return `${minute}:${seconds}`
    }


}