function createCube(
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
	sharedAngVel2,
	sharedAngVel3
) {
	let boxMesh;
	let tempShowNumbers = ifNumbers == null ? ctx.showNumbers : ifNumbers;
	let tempTransparent =
		ifTransparent == null ? ctx.toggleTransparent : ifTransparent;
	// let tempImage = ifImage == null ? showImage : ifImage;
	let tempFillColor = sharedColor != null ? sharedColor : ctx.presentColor;
	let tempTextColor =
		sharedTextColor != null ? sharedTextColor : ctx.textColor;

	if (tempShowNumbers) {
		let tileDimension = new THREE.Vector2(4, 2);
		let tileSize = 512;
		let g = new THREE.BoxGeometry(2, 2, 2);

		let c = document.createElement("canvas");
		c.width = tileSize * tileDimension.x;
		c.height = tileSize * tileDimension.y;
		let ctx = c.getContext("2d");
		ctx.fillStyle = tempFillColor;
		ctx.fillRect(0, 0, c.width, c.height);

		let baseUVs = [
			[0, 1],
			[1, 1],
			[0, 0],
			[1, 0],
		].map((p) => {
			return new THREE.Vector2(...p);
		});
		let uvs = [];
		let vTemp = new THREE.Vector2();
		let vCenter = new THREE.Vector2(0.5, 0.5);
		for (let i = 0; i < 6; i++) {
			let u = i % tileDimension.x;
			let v = Math.floor(i / tileDimension.x);
			baseUVs.forEach((buv) => {
				uvs.push(
					(buv.x + u) / tileDimension.x,
					(buv.y + v) / tileDimension.y
				);
			});

			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.font = `bold 300px Arial`;
			ctx.fillStyle = tempTextColor;
			ctx.fillText(
				i + 1,
				(u + 0.5) * tileSize,
				c.height - (v + 0.5) * tileSize
			);
		}
		g.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));

		let tex = new THREE.CanvasTexture(c);
		tex.colorSpace = THREE.SRGBColorSpace;

		let m = new THREE.MeshPhongMaterial({
			map: tex,
		});

		boxMesh = new THREE.Mesh(g, m);
	} else if (tempTransparent) {
		const boxTransparentGeometry = new THREE.BoxGeometry(2, 2, 2);
		const wireframe = new THREE.WireframeGeometry(boxTransparentGeometry);
		const lineMaterial = new THREE.LineBasicMaterial({
			color: sharedColor != null ? sharedColor : ctx.presentColor,
			depthTest: true,
			opacity: 1,
			transparent: false,
		});
		const line = new THREE.LineSegments(wireframe, lineMaterial);
		boxMesh = line;
	} else {
		const boxGeo = new THREE.BoxGeometry(2, 2, 2);
		const boxMat = new THREE.MeshPhongMaterial({
			color: sharedColor != null ? sharedColor : ctx.presentColor,
			wireframe: false,
		});
		boxMesh = new THREE.Mesh(boxGeo, boxMat);
	}
	boxMesh.castShadow = true;
	scene.add(boxMesh);



	let x = xCoordinateShared == null ? xCoordinate : xCoordinateShared;
	let z = zCoordinateShared == null ? zCoordinate : zCoordinateShared;
	let y = yCoordinateShared == null ? 10 : yCoordinateShared;

	const boxBody = new CANNON.Body({
		mass: 1,
		shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
		position: new CANNON.Vec3(x, y, z),
		material: new CANNON.Material(),
		restitution: 5,
	});

	world.addBody(boxBody);
	let angVel1 =
		sharedAngVel1 == null ? Math.random() * (1 - 0.1) + 0.1 : sharedAngVel1;
	let angVel2 =
		sharedAngVel2 == null ? Math.random() * (1 - 0.1) + 0.1 : sharedAngVel2;
	let angVel3 =
		sharedAngVel3 == null ? Math.random() * (1 - 0.1) + 0.1 : sharedAngVel3;
	boxBody.angularVelocity.set(angVel1, angVel2, angVel3);
	boxBody.angularDamping = 0.1; // This will help in reducing rotation over time
	boxBody.applyImpulse(ctx.offset, ctx.rollingForce);

	const contactMat = new CANNON.ContactMaterial(
		groundPhysMat,
		boxBody.material,
		{ friction: ctx.friction},
		
	);

	world.addContactMaterial(contactMat);
	if (quaternionShared != null && quaternionShared != undefined) {
		boxMesh.quaternion.copy(quaternionShared);
		boxBody.quaternion.copy(quaternionShared);
	}
	console.log(boxBody.material)
	diceArray.push([
		boxMesh,
		boxBody,
		"cube",
		tempShowNumbers,
		tempTransparent,
		tempFillColor,
		tempTextColor,
		angVel1,
		angVel2,
		angVel3,
		contactMat
	]);
}

function getCubeScore(scoresObject, body, ifRemove) {
	const faceVectors = [
		{
			vector: new THREE.Vector3(1, 0, 0),
			face: 1,
		},
		{
			vector: new THREE.Vector3(-1, 0, 0),
			face: 2,
		},
		{
			vector: new THREE.Vector3(0, 1, 0),
			face: 3,
		},
		{
			vector: new THREE.Vector3(0, -1, 0),
			face: 4,
		},
		{
			vector: new THREE.Vector3(0, 0, 1),
			face: 5,
		},
		{
			vector: new THREE.Vector3(0, 0, -1),
			face: 6,
		},
	];
	for (const faceVector of faceVectors) {
		faceVector.vector.applyEuler(body.rotation);
		if (Math.round(faceVector.vector.y) == 1) {
			if (!ifRemove) {
				scoresObject.lastRoll += faceVector.face + " + ";
				scoresObject.presentScore += faceVector.face;
			}
			return faceVector.face;
		}
	}
}