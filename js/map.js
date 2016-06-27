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

function getMapArr(size, ofsX, ofsZ) {
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
    for(var i = 0; i < width * height; i++)
        if(maps[i] == 1)
        {
            var tmpCube = new THREE.Mesh(
                new THREE.CubeGeometry(this.size,this.size,this.size),
                new THREE.MeshLambertMaterial({color:0x0000FF})
            );
            tmpCube.position.set(
                (i / width) * this.size - this.ofsX,
                size / 2,
                (i % width) * this.size - this.ofsZ);
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
