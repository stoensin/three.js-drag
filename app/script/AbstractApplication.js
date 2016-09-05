let THREE = require('three')
require('./controls/OrbitControls')
require('./loaders/OBJLoader')

class AbstractApplication{
    constructor(){
        this._camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
        this._camera.position.z = 400

        this._scene = new THREE.Scene()

        this._ObjLoader = new THREE.OBJLoader()

        this._renderer = new THREE.WebGLRenderer();
        this._renderer.setPixelRatio( window.devicePixelRatio );
        this._renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( this._renderer.domElement );

        this._controls = new THREE.OrbitControls( this._camera);
        //this._controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
        /*this._controls.enableDamping = true;
        this._controls.dampingFactor = 0.25;
        this._controls.enableZoom = false;*/

        window.addEventListener( 'resize', this.onWindowResize.bind(this), false );
    }

    onWindowResize() {

        this._camera.aspect = window.innerWidth / window.innerHeight;
        this._camera.updateProjectionMatrix();

        this._renderer.setSize( window.innerWidth, window.innerHeight );

    }

    animate(timestamp) {
        requestAnimationFrame( this.animate.bind(this) );
        this._controls.update();
        this._renderer.render( this._scene, this._camera );
    }

}

module.exports =  AbstractApplication