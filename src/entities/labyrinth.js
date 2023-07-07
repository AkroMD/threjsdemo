import {LabyrinthCeil} from "./labyrinth_ceil";
import {LinkCeil} from "./link_ceil";

export class Labyrinth {

    constructor(size) {

        this.map = {}
        this.walls = {}
        this.size = size;

        const getKeyWall = (x1, y1, x2, y2) => {
            return `${x1}_${y1}_${x2}_${y2}`
        }
        const setCeil = (x, y, param) => {
            this.map[this.getKeyCeil(x, y)] = param
        }
        const setWall = (x1, y1, x2, y2, param) => {
            this.walls[getKeyWall(x1, y1, x2, y2)] = param
        }
        const getWall = (x1, y1, x2, y2) => {
            return this.walls[getKeyWall(x1, y1, x2, y2)]
        }

        const formSimpleWalls = () => {
            for (let x = 0; x < size; x++) {

                for (let y = 0; y < size; y++) {

                    let param = new LabyrinthCeil({
                        x, y
                    })

                    if (x === 0) {
                        setWall(x - 1, y, x, y, new LinkCeil(x - 0.5, y - 0.5, x - 0.5, y + 0.5))
                    }
                    if (y === 0) {
                        setWall(x, y - 1, x, y, new LinkCeil(x - 0.5, y - 0.5, x + 0.5, y - 0.5))
                    }
                    if (y === size - 1) {
                        setWall(x, y, x, y + 1, new LinkCeil(x - 0.5, y + 0.5, x + 0.5, y + 0.5))
                    }
                    if (x === size - 1) {
                        setWall(x, y, x + 1, y, new LinkCeil(x + 0.5, y - 0.5, x + 0.5, y + 0.5))
                    }

                    if (x < size - 1 && y > 0) {

                        if (Math.random() > 0.5) {
                            setWall(x, y, x + 1, y, new LinkCeil(x + 0.5, y - 0.5, x + 0.5, y + 0.5))
                        } else {
                            setWall(x, y - 1, x, y, new LinkCeil(x - 0.5, y - 0.5, x + 0.5, y - 0.5))
                        }

                    }

                    setCeil(x, y, param)

                }
            }
        }

        const formTreasures = () => {

            let chance = -0.1;
            this.count_treasure = 0;

            for (let x = size - 1; x >= 0; x--) {

                for (let y = size - 1; y >= 0; y--) {

                    if (x === 0 && y === 0)
                        continue

                    const incCountWall = (condition, add) => {
                        if (condition) {
                            count_wall++
                            direction += add
                        }
                    }

                    let count_wall = 0;
                    let direction = 0;
                    incCountWall(y === size - 1 || getWall(x, y, x, y + 1), 1);
                    incCountWall(x === size - 1 || getWall(x, y, x + 1, y), -1);
                    incCountWall(y === 0 || getWall(x, y - 1, x, y), 1);
                    incCountWall(x === 0 || getWall(x - 1, y, x, y), -1);

                    if (count_wall === 3) {

                        if (Math.random() - chance > 0) {
                            chance += 2 / size
                            this.count_treasure++
                            this.map[this.getKeyCeil(x, y)].content = direction
                        } else {
                            chance -= 1 / size
                        }

                    }

                }
            }

        }

        formSimpleWalls()
        formTreasures()

    }

    getCeil(x, y) {
        return this.map[this.getKeyCeil(x, y)]
    }

    getKeyCeil(x, y) {
        return `${x}_${y}`
    }


}