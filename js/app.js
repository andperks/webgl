var app =
{
	camera : null,
	scene : null,
	renderer : null,
	mesh : null,
	pointLight : null,
	meshList : [ ],
	cubeCount : 100,

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

		// create a point light
		// pointLight = new THREE.PointLight( 0xFFFFFF );
		//
		// // set its position
		// pointLight.position.x = 300;
		// pointLight.position.y = 300;
		// pointLight.position.z = 430;
		//
		// // add to the scene
		// scene.add( pointLight );

		// CAMERA!
		camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
		camera.position.z = 1000;

		var geometry = new THREE.CubeGeometry( 200, 200, 200 );
		geometry.normalsNeedUpdate = true;

		var texture = THREE.ImageUtils.loadTexture( 'textures/glass1.png' );
		texture.anisotropy = renderer.getMaxAnisotropy( );

		var material = new THREE.MeshPhongMaterial(
		{
			map : texture,
			// transparent : true,
			// opacity : 0.4,
			// side : THREE.DoubleSide
		} );


		for ( var i = 0, j = app.cubeCount; i < j; i++ )
		{
			var mesh = new THREE.Mesh( geometry, material );
				mesh.rotation.x = ( Math.random( ) * 720 ) - 360 ;
				mesh.rotation.y = ( Math.random( ) * 720 ) - 360 ;
				mesh.position.y = ( Math.random( ) * 1500 ) - 750 ;
				mesh.position.x = ( Math.random( ) * 1500 ) - 750 ;
				mesh.position.z = 200 ;
				// mesh.position.z = ( Math.random( ) * 1000 ) - 500 ;
			
			app.meshList.push( mesh ) ;
						
			scene.add( mesh );
		};
		
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
		
		i = app.cubeCount - 1 ;
		
		while( i >= 0 )
		{
			app.meshList[ i ].rotation.x += Math.random() / 100;
			app.meshList[ i ].rotation.y += Math.random() / 100;
			i--;
		}
		
		// mesh.rotation.x += 0.005;
		// mesh.rotation.y += 0.01;

		renderer.render( scene, camera );
		// renderer.render( scene, camera, directionalLight );
	}
};
