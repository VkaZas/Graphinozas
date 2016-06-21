/**
 * Created by Administrator on 2016/6/21.
 */

function getAxisArr(len) {
    len = len || 100;
    var axis = [];
    var g1 = new THREE.Geometry();
    var g2 = new THREE.Geometry();
    var g3 = new THREE.Geometry();
    var p0 = new THREE.Vector3(0, 0, 0);
    var p1 = new THREE.Vector3(len, 0, 0);
    var p2 = new THREE.Vector3(0, len, 0);
    var p3 = new THREE.Vector3(0, 0, len);

    g1.vertices.push(p0, p1);
    axis.push(new THREE.Line(
        g1,
        new THREE.LineBasicMaterial({color: 0xFF0000, opacity: 0.5})
    ));
    g2.vertices.push(p0, p2);
    axis.push(new THREE.Line(
        g2,
        new THREE.LineBasicMaterial({color: 0x00FF00})
    ));
    g3.vertices.push(p0, p3);
    axis.push(new THREE.Line(
        g3,
        new THREE.LineBasicMaterial({color: 0x0000FF})
    ));
    // axis.push(new THREE.ArrowHelper(
    //     THREE.Vector3(0, 1, 0),
    //     THREE.Vector3(0, 0, 0),
    //     10, 0xFF0000, 3, 3));
    // axis.push(new THREE.ArrowHelper(
    //     THREE.Vector3(0, 0, 1),
    //     THREE.Vector3(0, 0, 0),
    //     10, 0x0000FF, 3, 3));
    // axis.push(new THREE.ArrowHelper(
    //     THREE.Vector3(1, 0, 0),
    //     THREE.Vector3(0, 0, 0),
    //     10, 0x00FF00, 3, 3));
    return axis;
}

function getGeoMap() {
    var geo = new THREE.PlaneGeometry(20, 20, 5, 5);
    var texture = new THREE.ImageUtils.loadTexture('./textures/planet1.jpg');
    var geoObj = new THREE.Mesh(
        geo,
        new THREE.MeshLambertMaterial({map:texture})
    );
    return geoObj;
}

function getRobot() {
    var manager = new THREE.LoadingManager();
    var obj;
    manager.onProgress = function(item, loaded, total) {
        console.log(item, loaded, total);
    };
    var loader = new THREE.ObjectLoader(manager);
    loader.load('./models/robot.obj',function(object) {
        object.traverse(function(child) {
            
        });
        object.updateMatrix();
        obj = object;
    });
    return obj;
}

function getPlayer() {
    var res = THREE.Object3D();
    var onProgress = function ( xhr ) {
        if ( xhr.lengthComputable ) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log( Math.round(percentComplete, 2) + '% downloaded' );
        }
    };

    var onError = function ( xhr ) { };

    THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );

    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath( './examples/obj/male02/' );
    mtlLoader.load( 'male02_dds.mtl', function( materials ) {

        materials.preload();

        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials( materials );
        objLoader.setPath( './examples/obj/male02/' );
        objLoader.load( 'male02.obj', function ( object ) {

            object.position.y = 0;
            object.scale.x = object.scale.y = object.scale.z = 0.05;
            object.rotation.set(1.585,0,0);
            res = object;
            return object;

        }, onProgress, onError );

    });
}