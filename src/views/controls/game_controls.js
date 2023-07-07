import {BaseControls} from "./base_controls";
import {Raycaster, Vector2, Vector3} from "three";
import {PointerLockControls} from "three/addons/controls/PointerLockControls";

export class GameControls extends BaseControls {

    acceleration = new Vector3(10, 98, 10)
    force = new Vector3(50, 15, 50);
    prevTime = performance.now()
    velocity = new Vector3()
    direction = new Vector3()
    moveForward = false;
    moveBackward = false;
    moveLeft = false;
    moveRight = false;
    canJump = false;
    objects = [];

    constructor(camera, dom_element, scene) {

        super();

        const initControls = () => {
            this._controls = new PointerLockControls(camera, dom_element);
            this.dom_element = dom_element;
            scene.add(this._controls.getObject())
        }
        const initRayCaster = () => {
            this.raycaster = new Raycaster(
                new Vector3(),
                new Vector3(0, -1, 0), 0, 10);
        }
        const initKeyEvents = () => {

            this.onkeyup = (event) => {
                this.keyup(event)
            }
            this.onkeydown = (event) => {
                this.keydown(event)
            }
            this.onclick = () => {
                this.click()
            }
            this.onunlock = (event) => {
                this.unlock(event)
            }
            document.addEventListener('keydown', this.onkeydown);
            document.addEventListener('keyup', this.onkeyup);
            dom_element.addEventListener('click', this.onclick);
            this._controls.addEventListener('unlock', this.onunlock);

            dom_element.click();
        }

        initControls()
        initRayCaster()
        initKeyEvents()

    }

    dispose() {

        this._controls.removeEventListener('unlock', this.onunlock);
        this._controls.unlock()
        this._controls.dispose()
        document.removeEventListener('keydown', this.onkeydown)
        document.removeEventListener('keyup', this.onkeyup)
        this.dom_element.removeEventListener('click', this.onclick)

    }

    update() {

        const {
            _controls,
            raycaster,
            velocity,
            direction,
            moveForward,
            moveRight,
            moveBackward,
            moveLeft, objects,
            prevTime,
        } = this

        const braking = () => {
            velocity.x -= velocity.x * this.acceleration.x * delta;
            velocity.z -= velocity.z * this.acceleration.z * delta;
            velocity.y -= this.acceleration.y * delta;
        }
        const formDirection = () => {

            direction.z = Number(moveForward) - Number(moveBackward);
            direction.x = Number(moveRight) - Number(moveLeft);
            direction.normalize();

            if (moveForward || moveBackward) velocity.z -= direction.z * this.force.z * delta;
            if (moveLeft || moveRight) velocity.x -= direction.x * this.force.x * delta;

        }
        const moving = () => {

            _controls.moveRight(-velocity.x * delta);
            _controls.moveForward(-velocity.z * delta);

            _controls.getObject().position.y += (velocity.y * delta);

            if (_controls.getObject().position.y < 1.7) {

                velocity.y = 0;
                _controls.getObject().position.y = 1.7;

                this.canJump = true;

            }
        }
        const collisions = () => {

            const checkCollision = (coordinate, invert) => {
                raycaster.setFromCamera(coordinate, camera);
                if (invert)
                    raycaster.ray.direction.multiplyScalar(-1)
                const intersections = raycaster.intersectObjects(objects, false);
                return intersections.length > 0 && intersections[0].distance < 0.2;
            }
            const stopPerson = () => {
                velocity.x = 0
                velocity.z = 0
            }

            const checked_positions = [
                {coordinate: new Vector2(1, 0), condition: velocity.x < 0.1},
                {coordinate: new Vector2(0, 0), condition: velocity.z < 0.1},
                {coordinate: new Vector2(0, 1), condition: velocity.z < 0.1},
                {coordinate: new Vector2(0, -1), condition: velocity.z < 0.1},
                {coordinate: new Vector2(-1, 0), condition: velocity.x > 0.1},
                {coordinate: new Vector2(0, 0), condition: velocity.z > 0.1, invert: true},
                {coordinate: new Vector2(0, 1), condition: velocity.z > 0.1, invert: true},
                {coordinate: new Vector2(0, -1), condition: velocity.z > 0.1, invert: true},

            ]
            for (let check_param of checked_positions) {
                if (check_param.condition && checkCollision(check_param.coordinate, check_param.invert)) {
                    stopPerson()
                    break
                }
            }

            this.update_function();

        }

        const time = performance.now();
        const camera = this._controls.getObject();
        const delta = (time - prevTime) / 1000;

        if (_controls.isLocked === true) {

            braking();
            formDirection()
            collisions()
            moving()

        }

        this.prevTime = time;
    }

    keydown(event) {
        switch (event.code) {

            case 'ArrowUp':
            case 'KeyW':
                this.moveForward = true;
                break;

            case 'ArrowLeft':
            case 'KeyA':
                this.moveLeft = true;
                break;

            case 'ArrowDown':
            case 'KeyS':
                this.moveBackward = true;
                break;

            case 'ArrowRight':
            case 'KeyD':
                this.moveRight = true;
                break;

            case 'Space':
                if (this.canJump === true) this.velocity.y += this.force.y;
                this.canJump = false;
                break;

        }
    }

    keyup(event) {

        switch (event.code) {

            case 'ArrowUp':
            case 'KeyW':
                this.moveForward = false;
                break;

            case 'ArrowLeft':
            case 'KeyA':
                this.moveLeft = false;
                break;

            case 'ArrowDown':
            case 'KeyS':
                this.moveBackward = false;
                break;

            case 'ArrowRight':
            case 'KeyD':
                this.moveRight = false;
                break;

        }

        this.actions[event.code] && this.actions[event.code]()
    }

    click() {
        this._controls.lock();
    }

    unlock() {
        this.escape()
    }

    setCollisionObjects(objects) {
        this.objects = objects
    }

    setActions(actions) {
        this.actions = actions
    }

    setUpdateFunction(update) {
        this.update_function = update;
    }

    setEscapeFunction(escape) {
        this.escape = escape;
    }

}