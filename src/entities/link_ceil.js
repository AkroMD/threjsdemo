export const LINK_CEIL_STATE = {
    OPEN: 0,
    WALL: 1,
    DOOR: 2,
}

export class LinkCeil {

    x1 = 0;
    y1 = 0;
    x2 = 0;
    y2 = 0;
    state = LINK_CEIL_STATE.OPEN

    constructor(x1, y1, x2, y2, options = {state: LINK_CEIL_STATE.OPEN}) {

        this.x1 = x1
        this.y1 = y1
        this.x2 = x2
        this.y2 = y2

        Object.assign(this, options)

    }

}