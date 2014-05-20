var app =
{
	camera : null,
	scene : null,
	renderer : null,
	mesh : null,
    video : null,
    canvas : null,
    context: null,
    originalFace : null,

    initVideo : function()
    {
        var errorCallback = function(e) {
            console.log('Reeeejected!', e);
        };

        // Not showing vendor prefixes.
        navigator.webkitGetUserMedia({video: true, audio: false}, function(stream)
        {
            video = document.querySelector('video');
            video.src = window.URL.createObjectURL(stream);

            // Note: onloadedmetadata doesn't fire in Chrome when using it with getUserMedia.
            // See crbug.com/110938.

            video.onloadedmetadata = function(e) {
                // Ready to go. Do some stuff.
                app.init();
                app.processWebcamVideo();
            };

        },
            errorCallback);
    },

    init : function( )
    {
        //3D bits
        renderer = new THREE.WebGLRenderer( );
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( renderer.domElement );

        //Video manipulation
        canvas = document.querySelector('canvas');
        context = canvas.getContext('2d');

        scene = new THREE.Scene( );

        // LIGHTS!
        var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
        directionalLight.position.set( 2, 2, 3 );
        scene.add( directionalLight );

        var ambiLight = new THREE.AmbientLight( 0x404040 );
        // soft white light
        scene.add( ambiLight );

        // CAMERA!
        camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
        camera.position.z = 400;

        // ER, GEOMETRY! and TEXTURES!
        var geometry = new THREE.CubeGeometry( 200, 200, 200 );

        var texture = THREE.ImageUtils.loadTexture( 'textures/glass1.png' );
        texture.anisotropy = renderer.getMaxAnisotropy( );

        var material = new THREE.MeshPhongMaterial(
            {
                map : texture,
                transparent : true,
                opacity : 1,
                side : THREE.DoubleSide
            } );

        mesh = new THREE.Mesh( geometry, material );
        scene.add( mesh );

        window.addEventListener( 'resize', app.onWindowResize, false );

        // ACTION!
        app.animate( );
    },

    processWebcamVideo : function() {

        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        var faces = app.detectFaces();

        app.highlightFaces(faces);

        if( app.originalFace && faces.length > 0)
        {
            app.scaleContent(faces[0]);
        }

        if( !app.originalFace && faces.length === 1)
        {
            app.originalFace = faces[0];
        }

        // Log process time
        // console.log(+new Date() - startTime);

        // And repeat.
        setTimeout( app.processWebcamVideo, 50 ) ;
    },

    detectFaces : function ()
    {
        // What do these parameters mean?
        // I couldn't find any documentation, and used what was found here:
        // https://github.com/liuliu/ccv/blob/unstable/js/index.html
        return ccv.detect_objects({canvas : (ccv.pre(canvas)), cascade: cascade, interval: 2, min_neighbors: 1});
    },

    // Draw found faces onto the canvas
    highlightFaces : function(faces) {
        if (!faces) {
            return false;
        }

        for (var i = 0; i < faces.length; i++) {
            var face = faces[i];
            context.fillRect(face.x, face.y, face.width, face.height);
        }
    },

    scaleContent : function(newFace)
    {
        var scaleFactor = app.originalFace.height / newFace.height;

        console.log( "scaleFactor", scaleFactor ) ;
        console.log( "faceX", newFace.x ) ;
        console.log( "faceY", newFace.y ) ;

        //content.style.setProperty('-o-transform', 'scale('+scaleFactor+')');
        //content.style.setProperty('-webkit-transform', 'scale('+scaleFactor+')');
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

		//mesh.rotation.x += 0.005;
		//mesh.rotation.y += 0.01;

		renderer.render( scene, camera );
	}
};
