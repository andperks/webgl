/**
 * Created by andy.perkins on 21/10/2013.
 */

function Trixel( mesh, positions )
{

    this.mesh = mesh;
    this.positions = positions ;

    this.gotoRandom = function( )
    {
        TweenMax.to( this.mesh.position,
            app.EXPLODE_TIME_SECONDS,
            { x : ( Math.random() * 800 ) - 400,
              y : ( Math.random() * 800 ) - 400,
              z : ( Math.random() * 800 ) - 400 });

        TweenMax.to( this.mesh.rotation,
            app.EXPLODE_TIME_SECONDS,
            { x : (( Math.random() * 360) * (Math.PI / 180) ),
              y : (( Math.random() * 360) * (Math.PI / 180) ),
              z : (( Math.random() * 360) * (Math.PI / 180) )}) ;
    };

    this.goTo = function( position )
    {

        TweenMax.to( this.mesh.position,
            app.BUILD_TIME_SECONDS,
            { x : this.positions[ position ].meshCentre.x,
              y : this.positions[ position ].meshCentre.y,
              z : this.positions[ position ].meshCentre.z });


        TweenMax.to( this.mesh.rotation,
            Math.random() * app.BUILD_TIME_SECONDS,
            { x : 0,
              y : 0,
              z : 0 });

//        for (var i = 0 ; i < 3 ; i++ )
//        {
        // move each vertex to new position
        // might / probably will used for changing meshes
//            var cv = this.mesh.geometry.vertices[ i ] ;
//            console.log( cv ) ;
//            TweenMax.to( cv, 2, { x : this.positions[ position ][ i ].x,
//                                  y : this.positions[ position ][ i ].y,
//                                  z : this.positions[ position ][ i ].z })
//        }
    };

}

function trixelate( mesh )
{
    console.log( "trixelate" ) ;

    // send a piece of geometry
    var ts = mesh.geometry.faces;       // triangles
    var vs = mesh.geometry.vertices;    // vertices

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
        var meshTargetVerts = [ vA, vB, vC ] ;

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
            var currentVertex = meshTargetVerts[ k ] ;

            var newX = currentVertex.x - meshTargetCentroid.x ;
            var newY = currentVertex.y - meshTargetCentroid.y ;
            var newZ = currentVertex.z - meshTargetCentroid.z ;

            var normalisedVertex = new THREE.Vector3( newX, newY, newZ ) ;

            normalisedVertices.push( normalisedVertex ) ;
        }

        // Build a new triangle with the normalised vertices
        var g = new THREE.Geometry( ) ;
            g.vertices.push( normalisedVertices[ 0 ] ) ;
            g.vertices.push( normalisedVertices[ 1 ] ) ;
            g.vertices.push( normalisedVertices[ 2 ] ) ;
            g.faces.push( new THREE.Face3( 0, 2, 1) ); // must be added counter-clockwise
            g.computeFaceNormals();
            g.dynamic = true;
            g.__dirtyVertices = true;
            g.__dirtyNormals = true;

        var mat = new THREE.MeshLambertMaterial(
        {
            color : 0x00AAAA,
            side  : THREE.DoubleSide
        });

        mat.needsUpdate= true;

        var tm = new THREE.Mesh( g, mat );

        var position = { meshVerts : meshTargetVerts, meshCentre : meshTargetCentroid } ;

        var trixel = new Trixel( tm, [ position ] ) ;

        app.trixels.push( trixel ) ;
    }
}