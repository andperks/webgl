var app =
{
    camera: null,
    scene: null,
    renderer: null,
    trixels: null,

    init: function () {

        trixels = [ ] ;
        renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        scene = new THREE.Scene();

        // LIGHTS!
        //create a point light
        pointLight = new THREE.PointLight(0xFFFFFF);

        // set its position
        pointLight.position.x = 0;
        pointLight.position.y = 180;
        pointLight.position.z = 350;

        // add to the scene
        scene.add(pointLight);

//        var ambiLight = new THREE.AmbientLight(0x404040);
//        // soft white light
//        scene.add(ambiLight);

        // CAMERA!
        camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
        camera.position.z = 400;

        // STUFF!
//        var geometry = new THREE.CubeGeometry(200, 200, 200);

        var geometry = new THREE.SphereGeometry( 200, 20, 20) ;

        trixelate( geometry ) ;

        window.addEventListener('resize', app.onWindowResize, false);

        // ACTION!
        app.animate();
    },

    onWindowResize: function () {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);

    },

    animate: function () {
        requestAnimationFrame(app.animate);

        // TODO: Loop through all items
        for (var i = 0, j = trixels.length; i < j; i++)
        {
            var t = trixels[ i ] ;
                t.mesh.rotation.x += Math.random() * 0.01;
                t.mesh.rotation.y += Math.random() * 0.01;
                t.mesh.rotation.z += Math.random() * 0.01;
        }

        renderer.render(scene, camera);
    }
};

/*
 var geometry = new THREE.Geometry();
 var v1 = new THREE.Vector3(0,0,0);   // Vector3 used to specify position
 var v2 = new THREE.Vector3(1,0,0);
 var v3 = new THREE.Vector3(0,1,0);   // 2d = all vertices in the same plane.. z = 0

 // add new geometry based on the specified positions
 geometry.vertices.push(v1);
 geometry.vertices.push(v2);
 geometry.vertices.push(v3);
 We then need to construct a face from our vertices, you pass in the indices of the vertices in the order they are pushed above.. [EDIT]: As mrdoob points out below, you also need to add them in counter clock-wise order. This was the problem with my fiddle. You can view the fixed demo here.

 geometry.faces.push(new THREE.Face3(0, 2, 1));
 Finally create a material and combine it with your geometry to create a Mesh. Even for 2D I believe you are required to create a mesh in order to display this.

 var redMat = new THREE.MeshBasicMaterial({color: 0xff0000});
 var triangle = new THREE.Mesh(geometry, redMat);
 scene.add(triangle)
 */

function trixelate(geometry) {

    // send a piece of geometry
    var ts = geometry.faces;       // triangles
    var vs = geometry.vertices;    // vertices

    var gs = [ ];                  //list of triangles

    // break it into component triangles
    for (var i = 0, j = ts.length; i < j; i++) {

        var t = ts[ i ];    //triangle

        var vA = vs[ t.a ];   // vertex
        var vB = vs[ t.b ];   // vertex
        var vC = vs[ t.c ];   // vertex

        var g = new THREE.Geometry( ) ;
            g.vertices.push( vA ) ;
            g.vertices.push( vB ) ;
            g.vertices.push( vC ) ;
            g.faces.push( new THREE.Face3( 1, 0, 2) ); // must be added counter-clockwise

//        var mat = new THREE.MeshLambertMaterial(
//        {
//            color: Math.random() * 0xFFFFFF
//        });

        var mat = new THREE.MeshBasicMaterial({ color : Math.random() * 0xFF0000 });
        var mesh = new THREE.Mesh( g, mat );
        var trixel = new Trixel( mesh ) ;

        trixels.push( trixel ) ;

        scene.add( trixel.mesh );
    }

}

function Trixel( mesh )
{
    this.mesh = mesh ;
}