let THREE = require('three')
let Hammer = require('hammerjs')

class Drag{
    constructor(controls,renderer,camera,objects){
        this.plane = new THREE.Plane()
        this.raycaster = new THREE.Raycaster()
        this.offset = new THREE.Vector3()
        this.intersection = new THREE.Vector3()
        this.INTERSECTED
        this.SELECTED
        this.mouse = new THREE.Vector2()
        this.camera = camera
        this.objects = objects
        this.controls = controls

        let hammer = new Hammer(renderer.domElement);
        let _this = this
        hammer.on('panstart',function(ev){
            _this.onDocumentMouseDown(ev);
        });
        hammer.on('panmove',function(ev){
            _this.onDocumentMouseMove(ev);
        });
        hammer.on('panend',function(ev){
            _this.onDocumentMouseUp(ev);
        });

        renderer.domElement.addEventListener( 'touchstart', this.onDocumentMouseMove.bind(this), false );

        renderer.domElement.addEventListener( 'mousemove', this.onDocumentMouseMove.bind(this), false );
        renderer.domElement.addEventListener( 'mousedown', this.onDocumentMouseDown.bind(this), false );
        renderer.domElement.addEventListener( 'mouseup', this.onDocumentMouseUp.bind(this), false );
    }

    onDocumentMouseMove( event ) {
        let x,y
        switch (event.type){
            case 'panmove':
                x = event.pointers[0].clientX
                y = event.pointers[0].clientY
                break;
            case 'touchstart':
                x = event.touches[0].clientX
                y = event.touches[0].clientY
                break;
            case 'mousemove':
                x = event.clientX
                y = event.clientY
        }

        event.preventDefault()

        this.mouse.x = ( x / window.innerWidth ) * 2 - 1
        this.mouse.y = - ( y / window.innerHeight ) * 2 + 1

        this.raycaster.setFromCamera( this.mouse, this.camera );

        if ( this.SELECTED ) {

            if ( this.raycaster.ray.intersectPlane( this.plane, this.intersection ) ) {

                this.SELECTED.position.copy( this.intersection.sub( this.offset ) );

            }

            return;

        }

        var intersects = this.raycaster.intersectObjects( this.objects,true);

        if ( intersects.length > 0 ) {
            if(event.type == "touchstart"){
                this.controls.enabled = false
            }

            if ( this.INTERSECTED != intersects[ 0 ].object ) {

                if ( this.INTERSECTED ) this.INTERSECTED.material.color.setHex( this.INTERSECTED.currentHex );

                this.INTERSECTED = intersects[ 0 ].object;
                this.INTERSECTED.currentHex = this.INTERSECTED.material.color.getHex();

                this.plane.setFromNormalAndCoplanarPoint(
                    this.camera.getWorldDirection( this.plane.normal ),
                    this.INTERSECTED.position );

            }


        } else {

            if ( this.INTERSECTED ) this.INTERSECTED.material.color.setHex( this.INTERSECTED.currentHex );

            this.INTERSECTED = null;

        }

    }

    onDocumentMouseDown( event ) {

        event.preventDefault()

        this.raycaster.setFromCamera( this.mouse, this.camera )

        var intersects = this.raycaster.intersectObjects( this.objects,true)

        if ( intersects.length > 0 ) {

            this.controls.enabled = false;

            // this.SELECTED = intersects[ 0 ].object;
            if (intersects[0].object.parent.tourType == 'infoTag') {
                this.SELECTED = intersects[0].object.parent
            }else{
                this.SELECTED = intersects[0].object;
            }

            if ( this.raycaster.ray.intersectPlane( this.plane, this.intersection ) ) {

                this.offset.copy( this.intersection ).sub( this.SELECTED.position )

            }
        }

    }

    onDocumentMouseUp( event ) {

        event.preventDefault()

        this.controls.enabled = true

        if ( this.INTERSECTED ) {

            this.SELECTED = null

        }

    }

}

module.exports = Drag
