import * as THREE from 'three'
import lineImg from '../../assets/touch-line.png'

interface RectVo {
  width: number,
  height: number,
  top: number,
  left: number,
}

export class TouchLine {
  width: number
  height: number
  realWidth: number
  realHeight: number
  scene: THREE.Scene
  plane?: THREE.Mesh
  screenRect: RectVo
  isActive: boolean = false
  minPercent: number
  originHeight: number

  constructor(scene: THREE.Scene, originWidth: number, minPercent: number, originHeight: number) {
    this.scene = scene
    this.realWidth = 750
    this.realHeight = 64
    this.width = originWidth
    this.height = this.realHeight / this.realWidth * this.width
    this.screenRect = {
      width: window.innerWidth,
      height: this.realHeight * window.innerWidth / this.realWidth,
      left: 0,
      top: window.innerHeight / 2 - (this.realHeight * window.innerWidth / this.realWidth) / 2,
    }
    this.minPercent = minPercent
    this.originHeight = originHeight

    const loader = new THREE.TextureLoader()
    loader.load(lineImg, (texture) => {
      const geo = new THREE.PlaneGeometry(this.width, this.height)
      const material = new THREE.MeshBasicMaterial({map: texture, transparent: true})
      this.plane = new THREE.Mesh(geo, material)
      this.plane.position.set(0, 0, 0)
      this.scene.add(this.plane)
    }, (xhr) => {
      console.log(xhr.loaded / xhr.total * 100, ' loaded')
    }, (xhr) => {
      console.log('texture loader error', xhr)
    })
  }

  isHover(e: MouseEvent) {
    let hover = false
    if (e.clientY >= this.screenRect.top && e.clientY <= this.screenRect.top + this.screenRect.height && e.clientX >= this.screenRect.left && e.clientX <= this.screenRect.left + this.screenRect.width) {
      hover = true
    }
    return hover
  }

  enable() {
    this.isActive = true
  }
  disable() {
    this.isActive = false
  }

  move(y: number) {
    if (y < window.innerHeight * this.minPercent) {
      y = window.innerHeight * this.minPercent
    }
    if (y > (window.innerHeight * (1 - this.minPercent))) {
      y = (window.innerHeight * (1 - this.minPercent))
    }
    const len = this.screenRect.top + this.screenRect.height / 2 - y
    const percent = len / window.innerHeight
    const len2 = this.originHeight * percent
    this.plane!.position.y += len2
    this.screenRect.top = y - this.screenRect.height / 2
  }
}
