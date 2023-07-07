import {
    CubeRefractionMapping,
    CubeTextureLoader,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
    HemisphereLight,
    SpotLight,
} from "three";
import {config} from "../../config";
import {BaseControls} from "./controls/base_controls";

export class GameView {

    controls = new BaseControls()
    models = []

    constructor(canvas) {

        const initScene = () => {
            this.scene = new Scene();
        }
        const initRender = () => {

            let rendererSettings = {antialias: true, canvas};

            this.renderer = new WebGLRenderer(rendererSettings);
            this.renderer.setPixelRatio(globalThis.devicePixelRatio);
            this.renderer.setSize(globalThis.innerWidth, globalThis.innerHeight);
        }
        const initBackgrounds = () => {

            const r = config.BACKGROUND_PREFIX + '/game_scene/';
            const urls = [
                r + "px.jpg", r + "nx.jpg",
                r + "py.jpg", r + "ny.jpg",
                r + "pz.jpg", r + "nz.jpg",
            ];

            const textureCube = new CubeTextureLoader().load(urls);
            textureCube.mapping = CubeRefractionMapping;

            this.scene.background = textureCube;

        }
        const initCamera = () => {

            const aspect = globalThis.innerWidth / globalThis.innerHeight;
            this.mainCamera = new PerspectiveCamera(75, aspect, 0.1, 100);
            this.mainCamera.position.set(5, 30, 5)
            this.mainCamera.lookAt(5, 0, 5)
            this.mainCamera.updateProjectionMatrix();

        }
        const initLight = () => {

            const spotLight = new SpotLight(0xffffff, 10, 7, Math.PI / 4, 1, 5);
            spotLight.castShadow = true;
            spotLight.position.set(0, 0, 0);
            spotLight.target.position.set(0, 0, -2);
            spotLight.shadow.mapSize.width = 1024;
            spotLight.shadow.mapSize.height = 1024;
            spotLight.shadow.camera.near = 1;
            spotLight.shadow.camera.far = 10;
            spotLight.shadow.focus = 1;

            this.mainCamera.add(spotLight)
            this.mainCamera.add(spotLight.target)

        }
        const blockBrowserEvent = () => {
            document.body.oncontextmenu = function () {
                return false;
            };
        }
        const initResizeEvent = () => {

            globalThis.addEventListener('resize', () => {
                this.mainCamera.aspect = globalThis.innerWidth / globalThis.innerHeight;
                this.mainCamera.updateProjectionMatrix();

                this.renderer.setSize(globalThis.innerWidth, globalThis.innerHeight);
            })

        }

        initScene()
        initCamera()
        initRender()
        initBackgrounds()
        initLight()
        blockBrowserEvent()
        initResizeEvent()

    }

    clear() {
        this.models.forEach(model => model.parent.remove(model))
        this.models.splice(0)
    }

    update() {

        const {
            renderer,
            mainCamera,
            controls,
            scene,
        } = this

        renderer.render(scene, mainCamera);
        controls.update();

        requestAnimationFrame(() => this.update());

    }

    addMesh(mesh) {
        this.scene.add(mesh)
        this.models.push(mesh)
    }

    setPositionCamera(position) {
        this.mainCamera.position.copy(position);
        this.mainCamera.updateProjectionMatrix();
    }

    changeControls(control) {
        this.controls.dispose()
        this.controls = control
    }

    addHemisphereLight() {
        const light = new HemisphereLight(0xffffff, 0x8d8d8d, 0.15);
        this.scene.add(light);
        return light
    }

    getCamera() {
        return this.mainCamera
    }

}