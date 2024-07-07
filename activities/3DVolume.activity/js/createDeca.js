const sides = 10;
const verticesGeo = [
    [0, 0, 1],
    [0, 0, -1],
].flat();

for (let i = 0; i < sides; ++i) {
    const b = (i * Math.PI * 2) / sides;
    verticesGeo.push(-Math.cos(b), -Math.sin(b), 0.105 * (i % 2 ? 1 : -1));
}

const facesGeo = [
    [0, 2, 3],
    [0, 3, 4],
    [0, 4, 5],
    [0, 5, 6],
    [0, 6, 7],
    [0, 7, 8],
    [0, 8, 9],
    [0, 9, 10],
    [0, 10, 11],
    [0, 11, 2],
    [1, 3, 2],
    [1, 4, 3],
    [1, 5, 4],
    [1, 6, 5],
    [1, 7, 6],
    [1, 8, 7],
    [1, 9, 8],
    [1, 10, 9],
    [1, 11, 10],
    [1, 2, 11],
].flat();

function createDecahedron(
    sharedColor,
    ifNumbers,
    ifTransparent,
    xCoordinateShared,
    zCoordinateShared,
    ifImage,
    sharedImageData,
    yCoordinateShared,
    quaternionShared,
    sharedTextColor,
    ctx,
    diceArray,
    world,
    scene,
    groundPhysMat,
    sharedAngVel1,
    sharedAngVel2
) {
    let decahedron;
    let tempShowNumbers = ifNumbers == null ? ctx.showNumbers : ifNumbers;
    let tempTransparent =
        ifTransparent == null ? ctx.toggleTransparent : ifTransparent;
    let tempFillColor = sharedColor != null ? sharedColor : ctx.presentColor;
    let tempTextColor =
        sharedTextColor != null ? sharedTextColor : ctx.textColor;

    const radius = 1.3;

    if (tempShowNumbers) {
        const baseGeometry = new THREE.BufferGeometry();

        const vertices = new Float32Array(verticesGeo);
        const indices = new Uint16Array(facesGeo);

        baseGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        baseGeometry.setIndex(new THREE.BufferAttribute(indices, 1));
        baseGeometry.computeVertexNormals();

        let tileDimension = new THREE.Vector2(2, 5); // 2 columns by 5 rows
        let tileSize = 512;

        let c = document.createElement("canvas");
        c.width = tileSize * tileDimension.x;
        c.height = tileSize * tileDimension.y;
        let ctx = c.getContext("2d");
        ctx.fillStyle = tempFillColor;
        ctx.fillRect(0, 0, c.width, c.height);

        const sideGeometries = [];
        const baseUVs = [
            new THREE.Vector2(0, 0),
            new THREE.Vector2(1, 0),
            new THREE.Vector2(1, 1),
            new THREE.Vector2(0, 1),
        ];

        for (let i = 0; i < 10; i++) {
            const clonedGeometry = baseGeometry.clone();

            // Recompute UVs
            let u = i % tileDimension.x;
            let v = Math.floor(i / tileDimension.x);
            const uvs = [];

            baseUVs.forEach(uv => {
                uvs.push(
                    (uv.x + u) / tileDimension.x,
                    (uv.y + v) / tileDimension.y
                );
            });

            clonedGeometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
            sideGeometries.push(clonedGeometry);

            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.font = `bold ${tileSize / 3}px Calistoga`;
            ctx.fillStyle = tempTextColor;
            ctx.fillText(
                i + 1,
                (u + 0.5) * tileSize,
                c.height - (v + 0.5) * tileSize
            );
        }

        const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(sideGeometries);
        mergedGeometry.computeVertexNormals();

        let tex = new THREE.CanvasTexture(c);
        tex.needsUpdate = true;

        let material = new THREE.MeshPhongMaterial({
            map: tex,
            color: tempFillColor,
        });

        decahedron = new THREE.Mesh(mergedGeometry, material);
    } else if (tempTransparent) {
        const wireframe = new THREE.WireframeGeometry(baseGeometry);
        const lineMaterial = new THREE.LineBasicMaterial({
            color: tempFillColor,
            depthTest: true,
            opacity: 1,
            transparent: false,
        });
        const line = new THREE.LineSegments(wireframe, lineMaterial);
        decahedron = line;
    } else {
        const material = new THREE.MeshStandardMaterial({
            color: tempFillColor,
            wireframe: false,
        });
        decahedron = new THREE.Mesh(baseGeometry, material);
    }

    decahedron.rotation.set(Math.PI / 4, Math.PI / 4, 0); // Rotates 90 degrees on X, 45 degrees on Y
    decahedron.castShadow = true;
    scene.add(decahedron);

    const verticesCannon = [];
    for (let i = 0; i < verticesGeo.length; i += 3) {
        verticesCannon.push(
            new CANNON.Vec3(
                verticesGeo[i] * 1.2, // Apply scale factor
                verticesGeo[i + 1] * 1.2,
                verticesGeo[i + 2] * 1.2
            )
        );
    }

    const facesCannon = [];
    for (let i = 0; i < facesGeo.length; i += 3) {
        facesCannon.push([facesGeo[i], facesGeo[i + 1], facesGeo[i + 2]]);
    }

    const decahedronShape = new CANNON.ConvexPolyhedron({
        vertices: verticesCannon,
        faces: facesCannon,
    });

    let x = xCoordinateShared == null ? xCoordinate : xCoordinateShared;
    let z = zCoordinateShared == null ? zCoordinate : zCoordinateShared;
    let y = yCoordinateShared == null ? 10 : yCoordinateShared;

    const decahedronBody = new CANNON.Body({
        mass: 2, // Set mass
        shape: decahedronShape,
        position: new CANNON.Vec3(x, y, z),
        friction: -1,
        restitution: 5,
    });
    world.addBody(decahedronBody);

    let angVel1 =
        sharedAngVel1 == null ? Math.random() * (1 - 0.1) + 0.1 : sharedAngVel1;
    let angVel2 =
        sharedAngVel2 == null ? Math.random() * (1 - 0.1) + 0.1 : sharedAngVel2;

    decahedronBody.angularVelocity.set(angVel1, angVel2, 0.5);
    decahedronBody.applyImpulse(ctx.offset, ctx.rollingForce);
    decahedron.position.copy(decahedronBody.position); // this merges the physics body to threejs mesh
    decahedron.quaternion.copy(decahedronBody.quaternion);

    if (quaternionShared != null && quaternionShared != undefined) {
        decahedron.quaternion.copy(quaternionShared);
        decahedronBody.quaternion.copy(quaternionShared);
    }

    diceArray.push([
        decahedron,
        decahedronBody,
        "deca",
        tempShowNumbers,
        tempTransparent,
        tempFillColor,
        tempTextColor,
        angVel1,
        angVel2,
    ]);
}