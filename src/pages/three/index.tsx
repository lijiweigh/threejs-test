import React, { useCallback, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'
import { Rubik } from './rubik'
import { TouchLine } from './touch-line'

const width = window.innerWidth
const height = window.innerHeight

const frontViewName = 'front-rubik'
const endViewName = 'end-rubik'

const minPercent = 0.25

export default function ThreeTest() {
  const canvas = useRef<HTMLCanvasElement | null>(null)
  const renderer = useRef<THREE.WebGLRenderer>()
  const camera = useRef<THREE.PerspectiveCamera>()
  const originPoint = useRef(new THREE.Vector3(0, 0, 0))
  const pointLight = useRef<THREE.PointLight>()
  const ambientLight = useRef<THREE.AmbientLight>()
  const cube = useRef<THREE.Mesh>()
  const scene = useRef<THREE.Scene>()
  const frontRubik = useRef<Rubik>()
  const endRubik = useRef<Rubik>()
  const orbitController = useRef<OrbitControls>()
  const trackBall = useRef<TrackballControls>()
  const touchLine = useRef<TouchLine>()

  const originHeight = useRef(750)
  const originWidth = useRef(64)

  const initRender = useCallback(() => {
   if (canvas.current) {
    renderer.current = new THREE.WebGLRenderer({
      canvas: canvas.current,
      antialias: true,
    })
    renderer.current?.setSize(width, height)
    renderer.current?.setClearColor('#000000', 1.0)
    renderer.current?.setPixelRatio(window.devicePixelRatio)
   }
  }, [])

  const initCamera = useCallback(() => {
    camera.current = new THREE.PerspectiveCamera(45, width / height, 1, 1000)
    camera.current.position.set(0, 0, 600)
    camera.current.up.set(0, 1, 0)
    camera.current.lookAt(originPoint.current)

    if (renderer.current) {
      // orbitController.current = new OrbitControls(camera.current, renderer.current.domElement)
      // orbitController.current.enableZoom = false
      // orbitController.current.rotateSpeed = 2
      // orbitController.current.target = originPoint.current

      // trackBall.current = new TrackballControls(camera.current, renderer.current.domElement)
      // trackBall.current.rotateSpeed = 1.0;
      // trackBall.current.zoomSpeed = 1.2;
      // trackBall.current.panSpeed = 0.8;

      // trackBall.current.keys = [ 'KeyA', 'KeyS', 'KeyD' ];
    }

  }, [])

  const initLight = useCallback(() => {
    // pointLight.current = new THREE.PointLight(0xffffff, 1, 2000)
    // pointLight.current.position.set(70, 112, 98)
    ambientLight.current = new THREE.AmbientLight(0xffffff)
  }, [])

  const initObject = useCallback(() => {
    // const geometry = new THREE.BoxGeometry(100, 100, 100)
    // const material = new THREE.MeshLambertMaterial({color: 0xff0000})
    // cube.current = new THREE.Mesh(geometry, material)
    // cube.current.position.set(0, 0, 0)
    if (scene.current && camera.current) {
      originHeight.current = Math.tan(22.5 / 180 * Math.PI) * camera.current.position.z * 2
      originWidth.current = originHeight.current * camera.current.aspect

      frontRubik.current = new Rubik(scene.current, minPercent, originHeight.current)
      frontRubik.current.model(frontViewName)

      endRubik.current = new Rubik(scene.current, minPercent, originHeight.current)
      endRubik.current.model(endViewName)

      frontRubik.current.resizeHeight(0.5, 1)
      endRubik.current.resizeHeight(0.5, -1)

      touchLine.current = new TouchLine(scene.current, originWidth.current, minPercent, originHeight.current)
    }

  }, [])

  const initScene = useCallback(() => {
    scene.current = new THREE.Scene()
    pointLight.current && scene.current.add(pointLight.current)
    ambientLight.current && scene.current.add(ambientLight.current)
    // cube.current && scene.current.add(cube.current)

  }, [])

  const render = useCallback(() => {
    if (renderer.current && camera.current && scene.current) {
      renderer.current.clear()
      renderer.current.render(scene.current, camera.current)
      // cube.current.rotation.x += 0.005
      // cube.current.rotation.y += 0.005
      requestAnimationFrame(render)
      // renderer.current.setAnimationLoop(() => {
      //   render()
      // })
    }
  }, [])

  const rubikResize = useCallback((f: number, e: number) => {
    if (frontRubik.current && endRubik.current) {
      frontRubik.current.resizeHeight(f, 1)
      endRubik.current.resizeHeight(e, -1)
    }
  }, [])

  const onMouseDown = useCallback((e: MouseEvent) => {
    console.log('onMouseDown', e)
    touchLine.current?.enable()
  }, [])

  const onMouseMove = useCallback((e: MouseEvent) => {
    // console.log('onMouseMove', e)
    if (touchLine.current?.isActive) {
      touchLine.current.move(e.clientY)
      const frontPercent = e.clientY / window.innerHeight
      const endPercent = 1 - frontPercent
      rubikResize(frontPercent, endPercent)
    }
  }, [])

  const onMouseUp = useCallback((e: MouseEvent) => {
    console.log('onMouseUp', e)
    touchLine.current?.disable()
  }, [])

  const initEvent = useCallback(() => {
    document.body.addEventListener('mousedown', onMouseDown)
    document.body.addEventListener('mousemove', onMouseMove)
    document.body.addEventListener('mouseup', onMouseUp)
  }, [])

  useEffect(() => {
    if (canvas.current) {
      initRender()
      initCamera()
      initLight()

      initScene()
      initObject()
      render()
      initEvent()
    }
  }, [])

  return (
    <canvas id='three' ref={canvas}></canvas>
  )
}