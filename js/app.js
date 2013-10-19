var app =
{
    camera: null,
    scene: null,
    renderer: null,
    trixels: null,

    init: function () {

        window.addEventListener('resize', app.onWindowResize, false);

        trixels = [ ] ;
        renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        scene = new THREE.Scene();

        // LIGHTS!
        //create a point light
        var pointLight = new THREE.PointLight(0xFFFFFF);

        // set its position
        pointLight.position.x = 100;
        pointLight.position.y = 180;
        pointLight.position.z = 350;

        // add to the scene
        scene.add(pointLight);

        var ambiLight = new THREE.AmbientLight(0x404040);
        // soft white light
        scene.add(ambiLight);

        // CAMERA!
        camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
        camera.position.z = 800;

        // STUFF!
//        var geometry = new THREE.CubeGeometry(200, 200, 200);

        var geometry = new THREE.SphereGeometry(200, 20, 20);
        var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial({ color: 0xFF00FF }));

        trixelate( mesh ) ; // TODO: Need to check loaded / JSON objects

        scene.add( mesh ) ;

        // ACTION!
        app.animate();

//        setTimeout(app.tween, 500);
    },

    animate : function () {
        requestAnimationFrame(app.animate);

        // TODO: Loop through all items
//        for (var i = 0, j = trixels.length; i < j; i++)
//        {
//            var t = trixels[ i ] ;
//            t.mesh.rotation.x += Math.random() * 0.01 ;
//            t.mesh.rotation.y += Math.random() * 0.01 ;
//            t.mesh.rotation.z += Math.random() * 0.01 ;
//        }

//        camera.rotation.y += 0.005;

        renderer.render(scene, camera);
    },

    tween : function () {
        for (var i = 0, j = trixels.length; i < j; i++) {
            var t = trixels[ i ];
//            TweenMax.to(t.mesh.position, 2, { x : (Math.random() * 400) - 200,
//                                              y : (Math.random() * 400) - 200,
//                                              z : (Math.random() * 400) - 200 } );

            TweenMax.to(t.mesh.position, 2, { x: t.homeX,
                y: t.homeY,
                z: t.homeZ });
        }
    },

    onWindowResize: function () {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
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

function trixelate( mesh ) {

    // send a piece of geometry
    var ts = mesh.geometry.faces;       // triangles
    var vs = mesh.geometry.vertices;    // vertices

    var gs = [ ];                  //list of triangles

    var triangles = [];

    // break it into component triangles
    for (var i = 0, j = ts.length; i < j; i++) {

        // Get each triangle on the object
        var t = ts[ i ];    //triangle

        // Grab a reference to the vertex at each corner
        var vB = vs[ t.b ];   // vertex
        var vC = vs[ t.c ];   // vertex
        var vA = vs[ t.a ];   // vertex

        // Stash vertex references
        // This will be the vertex positions in scene space for the final Trixel.
        var meshTargetVerts = { a : vA, b : vB, c : vC };

        // Create a virtual centroid for this triangle in scene space
        // Note : A mesh created from these positions will consider it's position to be 0,0,0
        // even though it may be physically anywhere in the scene. This is bad.
        var cx = (vA.x + vB.x + vC.x) / 3 ;
        var cy = (vA.y + vB.y + vC.y) / 3 ;
        var cz = (vA.z + vB.z + vC.z) / 3 ;
        // this will be the centroid position in space for the final Trixel.
        var meshTargetCentroid = { x : cx, y : cy, z : cz } ;

        // We need to normalise so that the vertices we actually use are positioned
        // around 0,0,0 in the scene, so that we can set the position of the Trixel naturally
        // So for each vertex, subtract the difference between it's position and the centroid
        // and create a new vertex at the normalised position (i.e. as if 0,0,0 was the centroid)

        var normalisedVertices = [ ] ;

        for( var k = 0, l = 3; k < l; k++ )
        {

        }


        triangles.push(verts);

//        var g = new THREE.Geometry( ) ;
//            g.vertices.push( vA ) ;
//            g.vertices.push( vB ) ;
//            g.vertices.push( vC ) ;
//            g.faces.push( new THREE.Face3( 0, 2, 1) ); // must be added counter-clockwise
//
////        var mat = new THREE.MeshLambertMaterial(
////        {
////            color: Math.random() * 0xFFFFFF
////        });
//
//        var mat = new THREE.MeshPhongMaterial({ color : Math.random() * 0xFF0000 }) ;
//
//        var tm = new THREE.Mesh( g, mat );
//
//        //centroid
//        var cx = (vA.x + vB.x + vC.x) / 3 ;
//        var cy = (vA.y + vB.y + vC.y) / 3 ;
//        var cz = (vA.z + vB.z + vC.z) / 3 ;
//
//        var trixel = new Trixel( tm ) ;
//
//        trixels.push( trixel ) ;
//
//        scene.add( trixel.mesh );
//
//        tm.position.x = cx ;
//        tm.position.y = cy ;
//        tm.position.z = cz ;


    }
/*
    for (var i = 0, j = triangles.length; i < j; i++) {
        var currentTriangle = triangles [ i ];

        var g = new THREE.Geometry();
//            g.vertices.push( currentTriangle.a ) ;
//            g.vertices.push( currentTriangle.b ) ;
//            g.vertices.push( currentTriangle.c ) ;
        g.faces.push(new THREE.Face3(0, 2, 1)); // must be added counter-clockwise

        var mat = new THREE.MeshBasicMaterial({ color: Math.random() * 0xFF0000 });

        var tm = new THREE.Mesh(g, mat);

        var trixel = new Trixel(tm);

        // centroid
        var cx = (currentTriangle.a.x + currentTriangle.b.x + currentTriangle.c.x) / 3;
        var cy = (currentTriangle.a.y + currentTriangle.b.y + currentTriangle.c.y) / 3;
        var cz = (currentTriangle.a.z + currentTriangle.b.z + currentTriangle.c.z) / 3;

        trixels.push(trixel);

        tm.position.x = 0;
        tm.position.y = 0;
        tm.position.z = 0;

        console.log(trixel.mesh);
//        scene.add(trixel.mesh);
    }
 */
}

function Trixel(mesh) {

    this.mesh = mesh;

}