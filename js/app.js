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

		//

		scene = new THREE.Scene( );

		// LIGHTS!
		var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
		directionalLight.position.set( 2, 2, 3 );
		scene.add( directionalLight );

		var ambiLight = new THREE.AmbientLight( 0x404040 );
		// soft white light
		scene.add( ambiLight );

		// var hemiLight = new THREE.HemisphereLight(0xFFFFFF, 0x666666, 1 );
		// scene.add( hemiLight ) ;

		// var light = new THREE.PointLight( 0xffffff, 1, 100 );
		// light.position.set( 0, 0, 0 );
		// scene.add( light );

		// CAMERA!
		camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
		camera.position.z = 400;

		var geometry = new THREE.CubeGeometry( 200, 200, 200 );

		var texture = THREE.ImageUtils.loadTexture( 'textures/glass1.png' );
		texture.anisotropy = renderer.getMaxAnisotropy( );

		var material = new THREE.MeshPhongMaterial(
		{
			map : texture,
			transparent : true,
			opacity : 0.4,
			side : THREE.DoubleSide
		} );

		mesh = new THREE.Mesh( geometry, material );
		scene.add( mesh );

		// material.opacity = 0.7;

		//
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
