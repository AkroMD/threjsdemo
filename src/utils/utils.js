export class Utils {

    static getMinutes(time) {
        return Math.trunc(time / 60)
    }

    static getSeconds(time) {

        let seconds = (time % 60).toString()
        if (seconds.length === 1)
            seconds = '0' + seconds
        return seconds

    }

}