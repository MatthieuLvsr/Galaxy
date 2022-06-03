import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { BufferGeometry, MaxEquation } from 'three'
import gsap from 'gsap'

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

// Particles
let loaded = 0
const texture1 = textureLoader.load('./textures/particles/1.png',()=>{loaded++})
const texture2 = textureLoader.load('./textures/particles/2.png',()=>{loaded++})
const texture3 = textureLoader.load('./textures/particles/3.png',()=>{loaded++})
const texture4 = textureLoader.load('./textures/particles/4.png',()=>{loaded++})
const texture5 = textureLoader.load('./textures/particles/5.png',()=>{loaded++})
const texture6 = textureLoader.load('./textures/particles/6.png',()=>{loaded++})
const texture7 = textureLoader.load('./textures/particles/7.png',()=>{loaded++})
const texture8 = textureLoader.load('./textures/particles/8.png',()=>{loaded++})
const texture9 = textureLoader.load('./textures/particles/9.png',()=>{loaded++})
const texture10 = textureLoader.load('./textures/particles/10.png',()=>{loaded++})
const texture11 = textureLoader.load('./textures/particles/11.png',()=>{loaded++})
const texture12 = textureLoader.load('./textures/particles/12.png',()=>{loaded++})
const texture13 = textureLoader.load('./textures/particles/13.png',()=>{loaded++})

const textures = [texture1,texture2,texture3,texture4,texture5,texture6,texture7,texture8,texture9,texture10,texture11,texture12,texture13]

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Galaxy
 */
const texturesNames = ['Point','Ring','Smoke','Dot','Shine','Moon','Aim','Small shine','Shining star','Heart','Star','Stripe','Large stripe']
const parameters = {}

parameters.count = 213400
parameters.size = 0.01
parameters.radius = 5.81
parameters.branch = 6
parameters.spin = 1.19
parameters.randomness = 1
parameters.randomnessPower = 2.477
parameters.insideColor = "#e24822"
parameters.outsideColor = "#6490c9"
let index = 8
parameters.texture = texturesNames[8]
parameters.rotating = true

let particlesGeometry = null
let particlesMaterial = null
let particles = null

const generateGalaxy = () =>
{
    if(particles != null)
    {
        particlesGeometry.dispose()
        particlesMaterial.dispose()
        scene.remove(particles)
    }
    particlesGeometry = new BufferGeometry()
    const positionArray = new Float32Array(parameters.count*3)
    const colors = new Float32Array(parameters.count * 3)

    const colorInside = new THREE.Color(parameters.insideColor)
    const colorOutside = new THREE.Color(parameters.outsideColor)

    for(let i = 0;i<parameters.count;i++)
    {
        const i3 = i * 3
        const radius = Math.random() * parameters.radius
        const spinAngle = radius * parameters.spin
        const branch = i%parameters.branch
        const branchAngle = (Math.PI * 2 / parameters.branch) * branch
        const randomX = Math.pow(Math.random(),parameters.randomnessPower) * (Math.random() > 0.5 ? 1 : -1)
        const randomY = Math.pow(Math.random(),parameters.randomnessPower) * (Math.random() > 0.5 ? 1 : -1)
        const randomZ = Math.pow(Math.random(),parameters.randomnessPower) * (Math.random() > 0.5 ? 1 : -1)
        // const randomisation = (Math.random() - 0.5) * parameters.randomness

        positionArray[i3  ] = (Math.cos(branchAngle + spinAngle) * radius) + randomX * parameters.randomness
        positionArray[i3+1] = (randomY /3) * parameters.randomness
        positionArray[i3+2] = (Math.sin(branchAngle + spinAngle) * radius) + randomZ * parameters.randomness
        
        const mixedColor = colorInside.clone()
        mixedColor.lerp(colorOutside,radius/parameters.radius)
        
        colors[i3  ] = mixedColor.r
        colors[i3+1] = mixedColor.g
        colors[i3+2] = mixedColor.b
    }
    particlesGeometry.setAttribute('position',new THREE.Float32BufferAttribute(positionArray,3))
    particlesGeometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3))
    particlesMaterial = new THREE.PointsMaterial()
    particlesMaterial.map = textures[index]
    particlesMaterial.size = parameters.size
    particlesMaterial.sizeAttenuation = true
    particlesMaterial.depthWrite = false
    particlesMaterial.blending = THREE.AdditiveBlending
    // particlesMaterial.color = new THREE.Color(parameters.color)
    particlesMaterial.vertexColors = true
    particles = new THREE.Points(particlesGeometry,particlesMaterial)
    scene.add(particles)
}
// generateGalaxy()

parameters.flip = ()=>{
    gsap.to(particles.rotation,{
        duration: 2,
        x: '+=3.14',
        y: '+=3.14',
        // z: '+=3',
        ease: 'power2.inOut'
    })
}

gui.add(parameters, 'count').min(100).max(1000000).step(100).name("Count").onFinishChange(generateGalaxy)
gui.add(parameters, 'size').min(0.001).max(0.1).step(0.001).name("Size").onFinishChange(generateGalaxy)
gui.add(parameters, 'radius').min(0.1).max(20).step(0.01).name("Radius").onFinishChange(generateGalaxy)
gui.add(parameters, 'branch').min(2).max(20).step(1).name("Branch").onFinishChange(generateGalaxy)
gui.add(parameters, 'spin').min(-5).max(5).step(0.01).name("Spin").onFinishChange(generateGalaxy)
gui.add(parameters, 'randomness').min(0).max(1).step(0.001).name("Randomness").onFinishChange(generateGalaxy)
gui.add(parameters, 'randomnessPower').min(1).max(10).step(0.001).name("Center gravity").onFinishChange(generateGalaxy)
gui.addColor(parameters, 'insideColor').name("Inside color").onFinishChange(generateGalaxy)
gui.addColor(parameters, 'outsideColor').name("Outside color").onFinishChange(generateGalaxy)
// gui.add(parameters,'texture').min(0).max(12).step(1).onFinishChange(generateGalaxy)
gui.add(parameters,'rotating')
gui.add(parameters,'texture').options(texturesNames).onFinishChange(()=>{index = texturesNames.findIndex(texture => texture === parameters.texture);generateGalaxy()})
gui.add(parameters,'flip')
gui.close()
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1.54433065024435
camera.position.y = 4.519134931468185
camera.position.z = 6.625970393518825
cameraGroup.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const mouse = {
    x:0,
    y:0
}
window.addEventListener('mousemove',(_event)=>
{
    mouse.x = (_event.clientX / sizes.width * 2) - 1
    mouse.y = - ((_event.clientY / sizes.height * 2) - 1)
})

/**
 * Animate
 */
const clock = new THREE.Clock()
let lastElapsedTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - lastElapsedTime
    lastElapsedTime = elapsedTime

    // Update camera
    cameraGroup.position.x += (mouse.x*0.3 - cameraGroup.position.x) * 0.05
    cameraGroup.position.y += (mouse.y*0.3 - cameraGroup.position.y) * 0.05
    // Update controls
    controls.update()
    // console.log(camera.position);

    // Update galaxy
    if(loaded === 13)
    {
        loaded = 0
        generateGalaxy()
    }
    if(particles != null && parameters.rotating)
    {
        particles.rotation.y += deltaTime/10
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()