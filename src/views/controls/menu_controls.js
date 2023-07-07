import {BaseControls} from "./base_controls";
import {MOUSE, Vector2, Vector3} from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls";


export class MenuControls extends BaseControls {

    velocity = 1;
    camera_position = new Vector2()

    constructor(camera, dom_element, target) {

        super();

        let controls = new OrbitControls(camera, dom_element)

        controls.minDistance = 0.1;
        controls.maxDistance = 80;
        controls.zoomSpeed = 0;
        controls.rotateSpeed = 0;
        controls.mouseButtons.RIGHT = MOUSE.NONE;
        controls.mouseButtons.MIDDLE = MOUSE.NONE;
        controls.mouseButtons.LEFT = MOUSE.NONE;
        controls.target.copy(target)
        this._controls = controls

    }

    dispose() {
        this._controls.dispose()
    }

    update() {

        const {camera_position, _controls, velocity} = this;

        let position = new Vector3(
            Math.cos(camera_position.x) * 25, Math.cos(camera_position.y) + 4 + 1.7,
            Math.sin(camera_position.x) * 25,
        );
        camera_position.x += 0.003 * velocity;
        camera_position.y += 0.01;

        _controls.object.position.copy(position);

        _controls.update();
    }

}