/**
 * Created by Administrator on 2016/6/21.
 */

var pi = 3.1415926;

function getGeoMap() {
    var geo = new THREE.PlaneGeometry(20, 20, 5, 5);
    var texture = new THREE.ImageUtils.loadTexture('./textures/planet1.jpg');
    var geoObj = new THREE.Mesh(
        geo,
        new THREE.MeshLambertMaterial({map:texture})
    );
    geoObj.rotation.set(-pi*3/2,0,0);
    return geoObj;
}

function getWalls(size, ofsX, ofsZ) {
    var i;
    var walls = [];
    this.ofsX = (ofsX || 9 / 2) * size;
    this.ofsZ = (ofsZ || 9 / 2) * size;
    this.size = size || 10;
    for (i=-1; i<=9; i++) {
        var wall;
        wall = getWall();
        wall.position.set(i * this.size - this.ofsX, size / 2, -1 * this.size - this.ofsZ);
        walls.push(wall);

        wall = getWall();
        wall.position.set(i * this.size - this.ofsX, size / 2, 9 * this.size - this.ofsZ);
        walls.push(wall);

        wall = getWall();
        wall.position.set(-1 * this.size - this.ofsX, size / 2, i * this.size - this.ofsZ);
        wall.rotateY(Math.PI/2);
        walls.push(wall);
        
        wall = getWall();
        wall.position.set(9 * this.size - this.ofsX, size / 2, i * this.size - this.ofsZ);
        wall.rotateY(Math.PI/2);
        walls.push(wall);
    }
    return walls;
}

function getMapArr(size, ofsX, ofsZ) {
    var i;
    var textureLoader = new THREE.TextureLoader();
    cubeMat = new THREE.MeshStandardMaterial( {
        roughness: 0.7,
        color: 0xffffff,
        bumpScale: 0.002,
        metalness: 0.2
    });
    textureLoader.load( "./textures/brick_diffuse.jpg", function( map ) {
        map.wrapS = THREE.RepeatWrapping;
        map.wrapT = THREE.RepeatWrapping;
        map.anisotropy = 4;
        map.repeat.set( 1, 1 );
        cubeMat.map = map;
        cubeMat.needsUpdate = true;
    } );
    textureLoader.load( "./textures/brick_bump.jpg", function( map ) {
        map.wrapS = THREE.RepeatWrapping;
        map.wrapT = THREE.RepeatWrapping;
        map.anisotropy = 4;
        map.repeat.set( 1, 1 );
        cubeMat.bumpMap = map;
        cubeMat.needsUpdate = true;
    } );
    this.ofsX = (ofsX || 9 / 2) * size;
    this.ofsZ = (ofsZ || 9 / 2) * size;
    this.size = size || 10;
    var cube = [];
    var width	= 9;
    var height 	= 9;
    var maps = [0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 1, 1, 0, 1, 0, 1, 0, 0,
        0, 1, 0, 0, 0, 0, 1, 1, 0,
        0, 1, 0, 1, 0, 1, 1, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 1, 1, 0, 1, 0, 1, 0,
        0, 1, 1, 0, 0, 0, 0, 1, 0,
        0, 0, 1, 0, 1, 0, 1, 1, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0];
    for(i = 0; i < width * height; i++)
        if(maps[i] == 1)
        {
            var tmpCube = new THREE.Mesh(
                new THREE.CubeGeometry(this.size,this.size,this.size),
                cubeMat
            );
            tmpCube.position.set(
                Math.floor(i / width) * this.size - this.ofsX,
                size / 2,
                (i % width) * this.size - this.ofsZ);
            tmpCube.castShadow = true;
            tmpCube.receiveShadow = true;
            cube.push(tmpCube);
        }
    return cube;
}

/*
*  If the orgObj do not have vertices attribute, the function will build
*  a border box for the orgObj using its lenX, lenY and lenZ attributes.
* */
function checkCollision(orgObj, collList) {
    if (!collList || collList.length == 0) return false;
    var verNum = (!!orgObj.vertices && orgObj.vertices.length) || 8;
    var hx = orgObj.objSize.x / 2, hy = orgObj.objSize.y / 2, hz = orgObj.objSize.z / 2;
    var ofsArr = [
        new THREE.Vector3(hx, hy, hz),
        new THREE.Vector3(hx, hy, -hz),
        new THREE.Vector3(hx, -hy, hz),
        new THREE.Vector3(hx, -hy, -hz),
        new THREE.Vector3(-hx, hy, hz),
        new THREE.Vector3(-hx, hy, -hz),
        new THREE.Vector3(-hx, -hy, hz),
        new THREE.Vector3(-hx, -hy, -hz)
    ];
    var verArr = [];
    var originPoint = orgObj.position.clone();

    /*todo: make this generic*/
    originPoint.y = 4;

    // constructing the border box
    for (var i=0; i<8; i++) {
        var tmpVec = originPoint.clone().add(ofsArr[i]);
        verArr.push(tmpVec);
    }
    // verArr = (!!orgObj.geometry && orgObj.geometry.vertices) || verArr;

    for (var vertexIndex = 0; vertexIndex < verNum; vertexIndex++)
    {
        var localVertex = verArr[vertexIndex].clone();
        // var globalVertex = localVertex.applyMatrix4( orgObj.matrix );
        var directionVector = localVertex.sub( originPoint );

        var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
        var collisionResults = ray.intersectObjects( collList );
        if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() )
            return true;
    }
}

function getWall(mirCam, ang) {
    ang = ang || 0;
    
    var mirrorMaterial = new THREE.MeshBasicMaterial({
        envMap : mirCam.renderTarget
    });

    var wallMat;
    var textureLoader = new THREE.TextureLoader();

    wallMat = new THREE.MeshStandardMaterial( {
        roughness: 0.1,
        color: 0xff0000,
        bumpScale: 0.002,
        metalness: 0.9
    });
    textureLoader.load( "./textures/metal.jpg", function( map ) {
        map.wrapS = THREE.RepeatWrapping;
        map.wrapT = THREE.RepeatWrapping;
        map.anisotropy = 6;
        map.repeat.set( 1, 1 );
        wallMat.map = map;
        wallMat.needsUpdate = true;
    } );
    
    var group = new THREE.Group();
    var object = [];
    object[0] = new THREE.Mesh(//mesh��three.js��һ����
        new THREE.CubeGeometry(1,4,1),
        wallMat
    );
    object[0].position.set(0, 0, 0);

    object[1] = new THREE.Mesh(
        new THREE.CylinderGeometry(1, 1, 0.2, 20, 0),
        wallMat
    );
    object[1].position.set(0, 2, 0);

    object[2] = new THREE.Mesh(
        new THREE.CylinderGeometry(0.5, 0.5, 0.6, 20, 0),
        wallMat
    );
    object[2].position.set(0, 2.3, 0);

    object[3] = new THREE.Mesh(
        new THREE.CylinderGeometry(0.6, 0.6, 0.1, 20, 0),
        wallMat
    );
    object[3].position.set(0, 2.65, 0);

    object[4] = new THREE.Mesh(
        new THREE.CylinderGeometry(0.7, 0.7, 0.4, 20, 0),
        wallMat
    );
    object[4].position.set(0, 2.9, 0);

    object[4] = new THREE.Mesh(
        new THREE.CylinderGeometry(0.8, 0.8, 0.15, 20, 0),
        wallMat
    );
    object[4].position.set(0, 2.95, 0);

    object[5] = new THREE.Mesh(
        new THREE.CubeGeometry(50, 3.5, 0.2),
        wallMat
    );
    object[5].position.set(24, -0.25, 0);

    object[6] = new THREE.Mesh(
        new THREE.CubeGeometry(50, 0.2, 0.8),
        mirrorMaterial
    );
    object[6].position.set(24, 1.6, 0);

    object[6] = new THREE.Mesh(
        new THREE.CubeGeometry(50, 3, 0.6),
        mirrorMaterial
    );
    object[6].position.set(24, -0.25, 0);
    for (var i=0; i<=6; i++) group.add(object[i]);
    group.scale.set(1.7,3,3);
    group.rotateY(ang);
    
    
    return group;
}


