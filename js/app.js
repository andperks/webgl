var app =
{
    camera: null,
    pointLight: null,
    scene: null,
    renderer: null,
    trixels: [ ],

    exploded: false,
    lightMove: true,
    cameraMove: true,
    cameraRotation: 0,
    lightRotation: 0,

    EXPLODE_ID: -1,
    SPHERE_ID: 0,
    CUBE_ID: 1,
    EXPLODE_TIME_SECONDS: 0.3,
    BUILD_TIME_SECONDS: 0.7,

    init : function ()
    {
        window.addEventListener('resize', app.onWindowResize, false);

        app.initScene( ) ;
        app.loadModel( ) ;
        app.initControls( ) ;

        app.loop( );
    },

    initScene : function( )
    {
        app.renderer = new THREE.WebGLRenderer( { antialias: true } );
        app.renderer.setSize(window.innerWidth, window.innerHeight);

        document.body.appendChild(app.renderer.domElement);

        app.scene = new THREE.Scene();

        // LIGHTS!
        //create a point light
        app.pointLight = new THREE.PointLight(0xFFFFFF);

        // add to the scene
        app.scene.add(app.pointLight);

        var ambiLight = new THREE.AmbientLight(0x222222);
        // soft white light
        app.scene.add(ambiLight);

        // CAMERA!
        var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
        var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
        app.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    },

    loadModel : function( )
    {
        console.log( "loadModel" ) ;
        var jsonLoader = new THREE.JSONLoader();
            jsonLoader.load("models/teapot.js", app.onModelLoaded );
    },

    onModelLoaded : function( geometry, materials )
    {
        console.log( "onModelLoaded" ) ;

        var material = new THREE.MeshFaceMaterial( materials );

        var model = new THREE.Mesh( geometry, material );
//            model.scale.set(100, 100, 100);

        trixelate( model );

        for (var i = 0, j = app.trixels.length; i < j; i++)
        {
            app.scene.add(app.trixels[ i ].mesh);
        }
    },

    initControls : function( )
    {
        // ACTION!
        $("#sphereButton").click(function () {
            app.tweenTrixels(app.SPHERE_ID);
            app.exploded = false;
        });

        $("#explodeButton").click(function () {
            app.tweenTrixels(app.EXPLODE_ID);
            app.exploded = true;
        });

        $("#cameraButton").click(function () {
            app.cameraMove = !app.cameraMove;
        });

        $("#lightButton").click(function () {
            app.lightMove = !app.lightMove;
        });
    },

    tweenTrixels : function( positionID )
    {
        for (var i = 0, j = app.trixels.length; i < j; i++)
        {
            var t = app.trixels[ i ];
            positionID == -1 ? t.gotoRandom() : t.goTo( positionID );
        }
    },

    loop : function( )
    {
        requestAnimationFrame( app.loop );

        //simple rotate camera
        if (app.cameraMove)
        {
            app.cameraRotation += 0.005;
            app.camera.position.y = 50;
            app.camera.position.x = Math.sin(app.cameraRotation) * 100;
            app.camera.position.z = Math.cos(app.cameraRotation) * 100;
            app.camera.lookAt( app.scene.position ); //the origin
        }

        //simple rotate light
        if (app.lightMove)
        {
            app.lightRotation += 0.05;
            app.pointLight.position.y = 500;
            app.pointLight.position.x = Math.sin(app.lightRotation) * 800;
            app.pointLight.position.z = Math.cos(app.lightRotation) * 800;
        }

        if ( app.exploded )
        {
            for (var i = 0, j = app.trixels.length; i < j; i++)
            {
                var t = app.trixels[ i ];


                {
                    t.mesh.rotation.z += 0.02;
                    t.mesh.rotation.y += 0.02;
                }

                // TODO: maybe need to do this on TweenMax Update or similar?
                // Prob need for morphing.
//            t.mesh.geometry.computeVertexNormals( );
//            t.mesh.geometry.computeFaceNormals( );
            }
        }

        app.renderer.render(app.scene, app.camera);
    },

    onWindowResize: function( )
    {

        app.camera.aspect = window.innerWidth / window.innerHeight;
        app.camera.updateProjectionMatrix();
        app.renderer.setSize(window.innerWidth, window.innerHeight);
    }
};

