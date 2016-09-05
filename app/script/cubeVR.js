let THREE = require('three')
let AbstractApplication =  require('./AbstractApplication')
let Drag = require('./drag/drag')

class CubeVR extends AbstractApplication{
    constructor(){
        super()

        let geometry = new THREE.BoxGeometry( 200, 200, 200 )
        let material = new THREE.MeshLambertMaterial( { color: 0x00ffff } )
        this.objects = []

       /* this._mesh = new THREE.Mesh( geometry, material )
        this._scene.add( this._mesh )
        this.objects.push(this._mesh)*/

        let _this = this
        this._ObjLoader.load('app/model/chair.obj',function(chairObj){
            chairObj.position.z = -10
            chairObj.scale.set(100,100,100)
            chairObj.tourType = "infoTag"
            _this._scene.add(chairObj)
            _this.objects.push(chairObj)
        })


        this._light = new THREE.SpotLight(0xffffff)
        this._light.position.set(100,500,1000)
        this._scene.add(this._light)
        this._scene.add(new THREE.AmbientLight(0x333333))

        this.animate()

        new Drag(this._controls,this._renderer,this._camera,this.objects)
    }
}

module.exports = CubeVR
