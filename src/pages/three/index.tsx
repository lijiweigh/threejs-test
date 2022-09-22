import React, { useCallback, useEffect, useRef } from 'react'
import * as THREE from 'three'

const width = window.innerWidth
const height = window.innerHeight

export default function ThreeTest() {
  const canvas = useRef<HTMLCanvasElement | null>(null)
  const renderer = useRef<THREE.WebGL1Renderer>()
  const camera = useRef<THREE.PerspectiveCamera>()
  const originPoint = useRef(new THREE.Vector3(0, 0, 0))
  const pointLight = useRef()
  const ambientLight = useRef()

  const initRender = useCallback(() => {
    renderer.current?.setSize(width, height)
    renderer.current?.setClearColor('#000000', 1.0)
    renderer.current?.setPixelRatio(window.devicePixelRatio)
  }, [])

  const initCamera = useCallback(() => {
    camera.current = new THREE.PerspectiveCamera(45, width / height, 1, 1000)
    camera.current.position.set(200, 400, 600)
    camera.current.up.set(0, 1, 0)
    camera.current.lookAt(originPoint.current)
  }, [])

  const initLight = useCallback(() => {

  }, [])

  useEffect(() => {
    if (canvas.current) {
      renderer.current = new THREE.WebGL1Renderer({
        canvas: canvas.current,
        antialias: true,
      })
      initRender()
      initCamera()
      initLight()
    }
  }, [])

  return (
    <canvas id='three' ref={canvas}></canvas>
  )
}