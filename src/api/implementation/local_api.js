const KEY_STORAGES = {
    SCORES: 'scores',
}

export class LocalApi {

    saveScores(object_scores) {
        localStorage.setItem(KEY_STORAGES.SCORES, JSON.stringify(object_scores))
    }

    getScores() {
        return localStorage.getItem(KEY_STORAGES.SCORES)
    }

}