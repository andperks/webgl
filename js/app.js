var app =
{
	camera : null,
	scene : null,
	renderer : null,
	mesh : null,

	init : function( )
	{

		renderer = new THREE.WebGLRenderer( );
		renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( renderer.domElement );

		scene = new THREE.Scene( );

		// LIGHTS!
        var light = new THREE.PointLight( 0xffffff, 1, 100 );
        light.position.set( 300, 300, 300 );
        scene.add( light );

		var ambiLight = new THREE.AmbientLight( 0x404040 );
		// soft white light
		scene.add( ambiLight );


		// CAMERA!
		camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
		camera.position.z = 400;


        // TEXTURES!
		var geometry = new THREE.CubeGeometry( 200, 200, 200 );

		var texture = THREE.ImageUtils.loadTexture( 'textures/glass1.png' );
		texture.anisotropy = renderer.getMaxAnisotropy( );

		var material = new THREE.MeshPhongMaterial(
		{
			map : texture
		} );

		mesh = new THREE.Mesh( geometry, material );
		scene.add( mesh );

		window.addEventListener( 'resize', app.onWindowResize, false );

		// ACTION!
		app.animate( );
	},

	onWindowResize : function( )
	{

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix( );

		renderer.setSize( window.innerWidth, window.innerHeight );

	},

	animate : function( )
	{
		requestAnimationFrame( app.animate );

		mesh.rotation.x += 0.005;
		mesh.rotation.y += 0.01;

		renderer.render( scene, camera );
		// renderer.render( scene, camera, directionalLight );
	}
};
