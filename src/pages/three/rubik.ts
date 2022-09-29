import * as THREE from 'three'

const BasicParams = {
  x: 0,
  y: 0,
  z: 0,
  num: 3,
  len: 50,
  colors: [
    '#ff6b02', '#dd422f',
		'#ffffff', '#fdcd02',
		'#3d81f7', '#019d53'
  ]
}

function faces(color: string) {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const context = canvas.getContext('2d') as CanvasRenderingContext2D
  context.fillStyle = 'rgba(0,0,0,1)'
  context.fillRect(0, 0, 256, 256)
  context.rect(16, 16, 224, 224)
  context.lineJoin = 'round'
  context.lineWidth = 16
  context.fillStyle = color
  context.strokeStyle = color
  context.stroke()
  context.fill()
  return canvas
}

function SimpleCube(x: number, y: number, z: number, num: number, len: number, colors: string[]) {
  const leftUpX = x - num / 2 * len
  const leftUpY = y + num / 2 * len
  const leftUpZ = z + num / 2 * len
  const cubes = []
  for (let i = 0; i < num; i++) {
    for (let j = 0; j < num * num; j++) {
      const myFaces = []
      for (let k = 0; k < 6; k++) {
        myFaces[k] = faces(BasicParams.colors[k])
      }
      const materais = []
      for (let k = 0; k < 6; k++) {
        const texture = new THREE.Texture(myFaces[k])
        texture.needsUpdate = true
        materais.push(new THREE.MeshLambertMaterial({map: texture}))
      }
      const cubeGeo = new THREE.BoxGeometry(len, len, len)
      const cube = new THREE.Mesh(cubeGeo, materais)
      cube.position.x = (leftUpX + len / 2) + (j % num) * len
      cube.position.y = (leftUpY - len / 2) - (parseInt(String(j / num)) * len)
      cube.position.z = (leftUpZ - len / 2) - i * len
      cubes.push(cube)
    }
  }
  return cubes
}

export class Rubik {
  scene: THREE.Scene
  cubes: THREE.Mesh<THREE.BoxGeometry, THREE.MeshLambertMaterial[]>[]
  group: THREE.Group
  minPercent: number
  originHeight: number

  constructor(scene: THREE.Scene, minPercent: number, originHeight: number) {
    this.scene = scene
    this.cubes = []
    this.group = new THREE.Group()
    this.minPercent = minPercent
    this.originHeight = originHeight
  }

  model(type: string) {
    this.group = new THREE.Group()
    // @ts-ignore
    this.group.childType = type
    this.cubes = SimpleCube(BasicParams.x, BasicParams.y, BasicParams.z, BasicParams.num, BasicParams.len, BasicParams.colors)
    for(const c of this.cubes) {
      this.group.add(c)
    }
    if(type === 'front-rubik'){
      this.group.rotateY(45/180*Math.PI);
    } else{
      this.group.rotateY((270-45) / 180 * Math.PI);
    }
    this.group.rotateOnAxis(new THREE.Vector3(1, 0, 1), 25 / 180 * Math.PI);
    this.scene.add(this.group)
  }

  resizeHeight(percent: number, tag: number) {
    if (percent < this.minPercent) {
      percent = this.minPercent
    }
    if (percent > (1 - this.minPercent)) {
      percent = 1 - this.minPercent
    }
    this.group.scale.set(percent, percent, percent)
    this.group.position.y = this.originHeight * (0.5 - percent / 2) * tag
  }
}