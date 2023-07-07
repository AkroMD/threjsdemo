import {BaseControls} from "./base_controls";
import {MOUSE} from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls";


export class DevelopControls extends BaseControls {

    constructor(camera, dom_element) {

        super();

        let controls = new OrbitControls(camera, dom_element)

        controls.minDistance = 0.1;
        controls.maxDistance = 80;
        controls.zoomSpeed = 1.5;
        controls.rotateSpeed = 0.5;
        controls.mouseButtons.RIGHT = MOUSE.ROTATE;
        controls.mouseButtons.MIDDLE = MOUSE.PAN;
        controls.mouseButtons.LEFT = MOUSE.NONE;

        this._controls = controls

    }

    update() {
        this._controls.update();
    }

    dispose() {
        this._controls.dispose();
    }

    lockAt(position) {

        this._controls.object.lookAt(position.x, position.y, position.z)
        this._controls.target.copy(position)

    }

}