export class Queue {

    _param = {}

    has(key) {
        return this._param[key]
    }

    add(key, action) {

        if (!this._param[key])
            this._param[key] = [];

        this._param[key].push(action)
    }

    remove(key) {
        delete this._param[key];
    }

    do(key) {
        this._param[key].forEach(action => action())
        this.remove(key);
    }

    clear() {
        this._param = {}
    }

}