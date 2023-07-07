import {
    BackSide,
    BufferAttribute,
    BufferGeometry,
    Color,
    DoubleSide,
    FrontSide,
    Group,
    LinearFilter,
    Mesh,
    MeshBasicMaterial,
    MeshLambertMaterial,
    MeshPhongMaterial,
    RepeatWrapping,
    SRGBColorSpace,
    TextureLoader,
    UVMapping,
    Vector2,
    Vector3
} from "three";
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils";
import {config} from "../../config";
import {Queue} from "../utils/queue";

const depth_wall = 0.1;
const height_wall = 3;

export class GenerateMesh {

    queue_loader = new Queue()
    cash_textures = {}
    textureLoader = new TextureLoader()

    constructor(size_ceil) {
        this.size_ceil = size_ceil
    }

    createLabyrinth(labyrinth) {

        let size = labyrinth.size;

        let group = new Group();
        let collision_objects = [];
        let treasure_objects = {};

        for (let wall of Object.values(labyrinth.walls)) {
            let wall_mesh = this.createWall(
                new Vector2(wall.x1 * this.size_ceil, wall.y1 * this.size_ceil),
                new Vector2(wall.x2 * this.size_ceil, wall.y2 * this.size_ceil)
            )
            group.add(wall_mesh)
            collision_objects.push(wall_mesh)
        }

        for (let x = 0; x < size + 1; x++) {

            if (x < size)
                for (let y = 0; y < size; y++) {
                    group.add(this.createPlate(new Vector2(x, y).multiplyScalar(this.size_ceil)));
                    if (Math.abs(labyrinth.getCeil(x, y).content)) {
                        let treasure_mesh = this.createTreasure(new Vector2(x * this.size_ceil, y * this.size_ceil), labyrinth.getCeil(x, y).content > 0)
                        group.add(treasure_mesh)
                        treasure_objects[labyrinth.getKeyCeil(x, y)] = treasure_mesh
                    }
                }
        }

        group.add(this.createCeiling(labyrinth.size))
        group.add(this.createGround(labyrinth.size * 4))

        return {group, collision_objects, treasure_objects}

    }

    createWall(p1, p2) {

        let sub_vec = p2.clone().sub(p1);
        let normal = new Vector2(-sub_vec.y, sub_vec.x)
            .normalize()
            .multiplyScalar(depth_wall);

        let points = [
            p1.clone().add(normal),
            p1.clone().sub(normal),
            p2.clone().sub(normal),
            p2.clone().add(normal),
        ]
        let planes = this.getParallelepiped(points, 0, height_wall, depth_wall * 2, sub_vec.length());
        let geometry = BufferGeometryUtils.mergeGeometries(planes.map((plane) => {
            return this.getBufferGeometryOfPoints(plane)
        }));

        let mesh = new Mesh(geometry);
        this.setMaterial(mesh, {
            url: config.TEXTURES_PREFIX + 'brick_brown.jpg',
            url_normal_map: config.TEXTURES_PREFIX + 'brick_brown_normal.png',
            size: {x: 1, y: 1},
        })
        return mesh

    }

    createPlate(position) {

        let depth = this.size_ceil * 0.5;
        let points = [
            new Vector2(depth, depth),
            new Vector2(-depth, depth),
            new Vector2(-depth, -depth),
            new Vector2(depth, -depth),
        ]
        let planes = this.getParallelepiped(points, 0, 0.1, depth, depth);

        let geometry = BufferGeometryUtils.mergeGeometries(planes.map((plane) => {
            return this.getBufferGeometryOfPoints(plane)
        }));

        geometry.translate(position.x, 0, position.y)
        let mesh = new Mesh(geometry);
        this.setMaterial(mesh, {
            url: config.TEXTURES_PREFIX + 'stone_wall3.jpg',
            url_normal_map: config.TEXTURES_PREFIX + 'stone_wall3_normal.png',
            size: {x: 2, y: 2},
        })
        return mesh
    }

    createCeiling(size) {


        let geometry = this.getBufferGeometryOfPoints(this.formSimplePlane([
                new Vector3(-1, height_wall, -1),
                new Vector3(size * 2 - 1, height_wall, -1),
                new Vector3(size * 2 - 1, height_wall, size * 2 - 1),
                new Vector3(-1, height_wall, size * 2 - 1),
            ],
            [
                0, 0,
                size * 2 + 2, 0,
                size * 2 + 2, size * 2 + 2,
                0, size * 2 + 2
            ]
        ));

        let mesh = new Mesh(geometry);
        this.setMaterial(mesh, {
            url: config.TEXTURES_PREFIX + 'paving_stones3.jpg',
            url_normal_map: config.TEXTURES_PREFIX + 'paving_stones3_normal.png',
            size: {x: 1, y: 1},
            side: FrontSide
        })
        return mesh
    }

    createTreasure(position, is_rotate) {

        const width = 1;
        const depth = 0.4;
        const height = 0.8;
        const height_cap = 0.3;
        const depth_inner = 0.005;

        let outer_points = [
            new Vector2(width, depth),
            new Vector2(-width, depth),
            new Vector2(-width, -depth),
            new Vector2(width, -depth),
        ]
        let inner_points = [
            new Vector2(width - depth_inner, depth - depth_inner),
            new Vector2(-width + depth_inner, depth - depth_inner),
            new Vector2(-width + depth_inner, -depth + depth_inner),
            new Vector2(width - depth_inner, -depth + depth_inner),
        ]

        let planes = [];
        let bottom_inner_points = [];
        let top_inner_points = [];
        let top_points = [];
        let bottom_points = [];

        const formPlane = (bottom_points, top_points, height, index1, index2) => {

            let p1 = bottom_points[index1];
            let p2 = bottom_points[index2];
            let p3 = top_points[index2];
            let p4 = top_points[index1];
            let _width = p1.clone()
                .sub(p2)
                .length();
            planes.push(
                this.formSimplePlane(
                    [
                        p1, p4, p3, p2,
                    ],
                    [
                        0, 0,
                        0, height,
                        _width, height,
                        _width, 0,
                    ]
                ),
            )
        }

        for (let index = 0; index < 4; index++) {

            const pushPoint = (array, point, y) => {
                array.push(new Vector3(point.x, y, point.y))
            }
            let out_point = outer_points[index];
            let inner_point = inner_points[index];

            pushPoint(bottom_points, out_point, 0);
            pushPoint(top_points, out_point, height);
            pushPoint(top_inner_points, inner_point, height);
            pushPoint(bottom_inner_points, inner_point, 0);

            if (index > 0) {

                formPlane(bottom_points, top_points, height, index - 1, index);
                formPlane(bottom_inner_points, top_inner_points, height, index - 1, index);
                formPlane(bottom_points, bottom_inner_points, depth_inner, index - 1, index);
                formPlane(top_points, top_inner_points, depth_inner, index - 1, index);

            }

        }
        formPlane(bottom_points, top_points, height, 3, 0);
        formPlane(bottom_inner_points, top_inner_points, height, 3, 0);
        formPlane(bottom_points, bottom_inner_points, depth_inner, 3, 0);
        formPlane(top_points, top_inner_points, depth_inner, 3, 0);

        let cap_points = [
            outer_points[0]
                .clone()
                .add(outer_points[3])
                .multiplyScalar(0.5),
            outer_points[1]
                .clone()
                .add(outer_points[2])
                .multiplyScalar(0.5),
        ]
        let cap_points3 = cap_points.map(point => new Vector3(point.x, height + height_cap, point.y));
        let _height = height_cap / Math.sin(Math.atan(height_cap / depth))
        planes.push(
            this.formSimplePlane(
                [
                    top_points[0], cap_points3[0], cap_points3[1], top_points[1],
                ],
                [
                    0, 0,
                    0, _height,
                    width, _height,
                    width, 0,
                ]
            ),
            this.formSimplePlane(
                [
                    top_points[2], cap_points3[1], cap_points3[0], top_points[3],
                ],
                [
                    0, 0,
                    0, _height,
                    width, _height,
                    width, 0,
                ]
            ),
        )

        let geometry = BufferGeometryUtils.mergeGeometries(planes.map((plane) => {
            return this.getBufferGeometryOfPoints(plane)
        }));
        if (is_rotate)
            geometry.rotateY(Math.PI * 0.5)
        geometry.translate(position.x, 0, position.y)

        let mesh = new Mesh(geometry);
        this.setMaterial(mesh, {
            //color: 0xA67500,
            url: config.TEXTURES_PREFIX + 'wood_dark.jpg',
            url_normal_map: config.TEXTURES_PREFIX + 'wood_dark_normal.png',
            size: {x: 1, y: 1},
        })

        return mesh

    }

    createGround(size) {

        let geometry = this.getBufferGeometryOfPoints(this.formSimplePlane([
                new Vector3(-1, -0.001, -1),
                new Vector3(size * 2 + 1, 0.001, -1),
                new Vector3(size * 2 + 1, 0.001, size * 2 + 1),
                new Vector3(-1, 0.001, size * 2 + 1),
            ],
            [
                0, 0,
                size * 2 + 2, 0,
                size * 2 + 2, size * 2 + 2,
                0, size * 2 + 2
            ]
        ));

        geometry.translate(-size * 0.5, 0, -size * 0.5)

        let mesh = new Mesh(geometry);
        this.setMaterial(mesh, {
            url: config.TEXTURES_PREFIX + 'grass.jpg',
            url_normal_map: config.TEXTURES_PREFIX + 'grass_normal.png',
            size: {x: 1, y: 1},
            side: BackSide
        })
        return mesh
    }

    getBufferGeometryOfPoints({positions, indices, texture_coordinates}) {

        const addTextureCoordinate = () => {
            if (texture_coordinates) {
                geometry.setAttribute('uv', new BufferAttribute(new Float32Array(texture_coordinates), 2));
            }
        }

        let geometry = new BufferGeometry();
        geometry.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3));
        geometry.setIndex(indices);
        addTextureCoordinate()
        geometry.computeVertexNormals();

        return geometry
    }

    formSimplePlane(points, texture_coordinates) {

        let positions = [];
        points.forEach(point => positions.push(
            point.x, point.y, point.z
        ))
        return {
            positions, indices: [0, 1, 2, 2, 3, 0], texture_coordinates, points,
        }
    }

    getParallelepiped(points, y, height, depth, long) {

        const planes = [];

        let points_bottom = points.map(point2 => new Vector3(point2.x, y, point2.y));
        let points_top = points.map(point2 => new Vector3(point2.x, y + height, point2.y));
        const formPlane = (points, texture_coordinate) => {
            planes.push(this.formSimplePlane(points, texture_coordinate))
        }

        points_bottom.forEach((point, index) => {

            let next_bottom_point = points_bottom[(index + 1) % points_bottom.length];
            let width = point.clone()
                .sub(next_bottom_point)
                .length();

            formPlane(
                [
                    point, points_top[index],
                    points_top[(index + 1) % points_top.length],
                    next_bottom_point,
                ],
                [
                    0, 0,
                    0, height,
                    width, height,
                    width, 0,
                ]
            )

        })

        formPlane(points_bottom, [
            0, 0,
            0, depth,
            long, depth,
            long, 0
        ]);
        formPlane(points_top.reverse(), [
            long, 0,
            long, depth,
            0, depth,
            0, 0,
        ]);

        return planes

    }

    setMaterial(mesh, param) {
        const {
            url,
            url_normal_map,
            rotation_texture = 0,
            offset_texture = new Vector2(),
            center_texture = new Vector2(),
            size = {x: 1, y: 1},
            repeat = RepeatWrapping,
            side = DoubleSide,
            shadow = true,
            is_basic,
        } = param;

        let color = param.color ?? 0xdddddd;
        color = new Color(color)

        const formPhotoMaterial = () => {

            const getKeyTexture = (url) => {
                return `${url}_${size.x}_${rotation_texture}_${center_texture.x}_${center_texture.y}_${offset_texture.x}_${offset_texture.y}`
            }
            const setParamTexture = (texture) => {
                texture.wrapS = texture.wrapT = repeat;
                texture.repeat.set(size.x, size.y);
                texture.rotation = rotation_texture;
                texture.center = center_texture;
                texture.offset = offset_texture;
                texture.colorSpace = SRGBColorSpace;
                texture.minFilter = texture.magFilter = LinearFilter;
                texture.mapping = UVMapping;
            }
            const setTexture = () => {

                let texture = this.cash_textures[getKeyTexture(url)];
                setParamTexture(texture)

                mesh.material = new MeshPhongMaterial({
                    fog: false,
                    side,
                    map: texture,
                })
                setPolygonOffset();
                loadNormalMap();
            }
            const setNormalMap = () => {
                let texture = this.cash_textures[getKeyTexture(url_normal_map)];
                setParamTexture(texture);
                mesh.material.normalMap = texture;
                mesh.material.needsUpdate = true;
            }
            const loadTexture = () => {

                if (!url) {
                    return;
                }

                let key_texture = getKeyTexture(url);

                if (this.cash_textures[key_texture]) {
                    setTexture()
                } else {

                    let start_load = !this.queue_loader.has(key_texture);
                    this.queue_loader.add(key_texture, setTexture)

                    if (start_load) {

                        this.textureLoader.load(url, (texture) => {

                            this.cash_textures[key_texture] = texture;
                            this.queue_loader.do(key_texture);

                        });

                    }

                }

            }

            const loadNormalMap = () => {

                if (!url_normal_map) {
                    return;
                }

                let key_texture = getKeyTexture(url_normal_map);

                if (this.cash_textures[key_texture]) {
                    setNormalMap();
                } else {

                    let start_load = !this.queue_loader.has(key_texture);
                    this.queue_loader.add(key_texture, setNormalMap)

                    if (start_load) {
                        this.textureLoader.load(url_normal_map, (texture) => {
                            this.cash_textures[key_texture] = texture;
                            this.queue_loader.do(key_texture)
                        });
                    }
                }
            }

            loadTexture();

        }
        const formBasicMaterial = () => {
            mesh.material = new MeshBasicMaterial({
                color,
                fog: false,
                side,
            });
        }
        const formSimpleMaterial = () => {
            mesh.material = new MeshLambertMaterial({
                color,
                fog: false,
                side,
            });
        }
        const setPolygonOffset = () => {

            const {polygonOffsetFactor} = param;

            if (polygonOffsetFactor) {
                mesh.material.polygonOffset = true;
                mesh.material.polygonOffsetFactor = polygonOffsetFactor || 0;
                mesh.material.polygonOffsetUnits = polygonOffsetFactor * 4 || 0;
            }

        }

        url ?
            formPhotoMaterial() :
            is_basic ? formBasicMaterial() : formSimpleMaterial();

        setPolygonOffset()

        mesh.castShadow = mesh.receiveShadow = shadow;
    }


}