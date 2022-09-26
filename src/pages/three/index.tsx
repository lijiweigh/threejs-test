import React, { useCallback, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'
import { Rubik } from './rubik'

const width = window.innerWidth
const height = window.innerHeight

export default function ThreeTest() {
  const canvas = useRef<HTMLCanvasElement | null>(null)
  const renderer = useRef<THREE.WebGLRenderer>()
  const camera = useRef<THREE.PerspectiveCamera>()
  const originPoint = useRef(new THREE.Vector3(0, 0, 0))
  const pointLight = useRef<THREE.PointLight>()
  const ambientLight = useRef<THREE.AmbientLight>()
  const cube = useRef<THREE.Mesh>()
  const scene = useRef<THREE.Scene>()
  const rubik = useRef<Rubik>()
  const orbitController = useRef<OrbitControls>()
  const trackBall = useRef<TrackballControls>()

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
      orbitController.current = new OrbitControls(camera.current, renderer.current.domElement)
      orbitController.current.enableZoom = false
      orbitController.current.rotateSpeed = 2
      orbitController.current.target = originPoint.current
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
    if (scene.current) {
      rubik.current = new Rubik(scene.current)
      rubik.current.model()
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

  useEffect(() => {
    if (canvas.current) {
      initRender()
      initCamera()
      initLight()

      initScene()
      initObject()
      render()
    }
  }, [])

  return (
    <canvas id='three' ref={canvas}></canvas>
  )
}