import * as THREE from 'three';
import { gsap } from 'gsap';

/* -------------------------------------------------------------
 * Three.js Scene Configuration
 * ------------------------------------------------------------- */

// Canvas selection
const canvas = document.querySelector('#webgl-canvas');
if (!canvas) {
  console.error('WebGL canvas element not found');
}

// Scene creation
const scene = new THREE.Scene();

// Sizing
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0, 0, 25); // Start far away in deep space for swoop intro
scene.add(camera);

// Cinematic swoop timeline trigger on load-complete
window.addEventListener('load-complete', () => {
  gsap.to(camera.position, {
    z: 8.5,
    y: 1.8,
    duration: 2.5,
    ease: 'power3.inOut'
  });
});

// Renderer setup
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
  antialias: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/* -------------------------------------------------------------
 * Lighting Design
 * ------------------------------------------------------------- */
const ambientLight = new THREE.AmbientLight('#040e2b', 2.0); // Ambient deep sapphire-blue glow
scene.add(ambientLight);

// Electric Blue Light (left side)
const cyanPointLight = new THREE.PointLight('#00d2ff', 8.0, 30);
cyanPointLight.position.set(-6, 3, 2);
scene.add(cyanPointLight);

// Deep Indigo Light (right side)
const pinkPointLight = new THREE.PointLight('#4d00ff', 10.0, 30);
pinkPointLight.position.set(6, -3, 2);
scene.add(pinkPointLight);

// Directional white key light for physical material reflection
const directionalLight = new THREE.DirectionalLight('#ffffff', 3.0);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

/* -------------------------------------------------------------
 * Procedural Glowing Point Texture Helper
 * ------------------------------------------------------------- */
function createCircleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 16;
  canvas.height = 16;
  const ctx = canvas.getContext('2d');
  
  const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
  gradient.addColorStop(0.6, 'rgba(0, 210, 255, 0.3)');
  gradient.addColorStop(1, 'rgba(0, 210, 255, 0)');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 16, 16);
  
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}
const particleTexture = createCircleTexture();

/* -------------------------------------------------------------
 * Starfield / Particle Nebula
 * ------------------------------------------------------------- */
const particlesCount = 4500;
const positions = new Float32Array(particlesCount * 3);
const colors = new Float32Array(particlesCount * 3);

const colorCyan = new THREE.Color('#00d2ff');  // Electric Blue
const colorPink = new THREE.Color('#0076ff');  // Neon Blue
const colorPurple = new THREE.Color('#4d00ff'); // Deep Indigo
const colorWhite = new THREE.Color('#ffffff');

for (let i = 0; i < particlesCount; i++) {
  // Spawn in a wide cylindrical galaxy shape
  const angle = Math.random() * Math.PI * 2;
  const radius = Math.random() * 22 + 2;
  const height = (Math.random() - 0.5) * 35; // tall cylinder to span all scroll heights

  positions[i * 3 + 0] = Math.cos(angle) * radius;
  positions[i * 3 + 1] = height;
  positions[i * 3 + 2] = Math.sin(angle) * radius;

  // Blue-themed nebula color mixing
  let mixedColor = colorWhite.clone();
  const rnd = Math.random();
  if (rnd < 0.35) {
    mixedColor = colorCyan.clone().lerp(colorPurple, Math.random());
  } else if (rnd < 0.7) {
    mixedColor = colorPink.clone().lerp(colorPurple, Math.random());
  } else if (rnd < 0.9) {
    mixedColor = colorPurple.clone().lerp(colorWhite, Math.random());
  }
  
  colors[i * 3 + 0] = mixedColor.r;
  colors[i * 3 + 1] = mixedColor.g;
  colors[i * 3 + 2] = mixedColor.b;
}

const particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const particlesMaterial = new THREE.PointsMaterial({
  size: 0.12,
  sizeAttenuation: true,
  vertexColors: true,
  transparent: true,
  alphaMap: particleTexture,
  depthWrite: false,
  blending: THREE.AdditiveBlending
});

const starfield = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(starfield);

/* -------------------------------------------------------------
 * Floating Abstract Shapes
 * ------------------------------------------------------------- */
const meshesGroup = new THREE.Group();
scene.add(meshesGroup);

// Shape 1: Glass TorusKnot (Hero Area)
const torusGeometry = new THREE.TorusKnotGeometry(1.2, 0.4, 150, 20);
const torusMaterial = new THREE.MeshPhysicalMaterial({
  color: '#0076ff', // neon blue
  roughness: 0.15,
  metalness: 0.1,
  transmission: 0.6, // Glass transparency
  ior: 1.5,
  thickness: 1.5,
  clearcoat: 1.0,
  clearcoatRoughness: 0.1
});
const torusMesh = new THREE.Mesh(torusGeometry, torusMaterial);
torusMesh.position.set(2.5, 0, 0);
meshesGroup.add(torusMesh);

// Shape 2: Metal Octahedron (About Area)
const octahedronGeometry = new THREE.OctahedronGeometry(1.3, 0);
const octahedronMaterial = new THREE.MeshStandardMaterial({
  color: '#00d2ff', // electric blue
  metalness: 0.9,
  roughness: 0.2
});
const octahedronMesh = new THREE.Mesh(octahedronGeometry, octahedronMaterial);
octahedronMesh.position.set(-2.5, -8, -2);
meshesGroup.add(octahedronMesh);

// Shape 3: Wireframe Ring Sphere (Projects Area)
const projectsSphereGeometry = new THREE.IcosahedronGeometry(1.5, 1);
const projectsSphereMaterial = new THREE.MeshBasicMaterial({
  color: '#4d00ff', // indigo
  wireframe: true,
  transparent: true,
  opacity: 0.4
});
const projectsSphereMesh = new THREE.Mesh(projectsSphereGeometry, projectsSphereMaterial);
projectsSphereMesh.position.set(0, -16, -3);
meshesGroup.add(projectsSphereMesh);

/* -------------------------------------------------------------
 * Form Submission Spark Explosion
 * ------------------------------------------------------------- */
let explosionParticles = [];

function triggerFormExplosion() {
  const sparkCount = 120;
  const sparkPositions = new Float32Array(sparkCount * 3);
  const sparkColors = new Float32Array(sparkCount * 3);
  const velocities = [];

  const sparkGeometry = new THREE.BufferGeometry();
  
  // Set starting positions at center camera area (focused on screen view)
  const originX = camera.position.x;
  const originY = camera.position.y - 1; // Slightly lower than view center
  const originZ = camera.position.z - 3;

  for (let i = 0; i < sparkCount; i++) {
    sparkPositions[i * 3 + 0] = originX;
    sparkPositions[i * 3 + 1] = originY;
    sparkPositions[i * 3 + 2] = originZ;

    // Vector velocity direction
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);
    const speed = Math.random() * 0.15 + 0.05;

    velocities.push({
      x: Math.sin(phi) * Math.cos(theta) * speed,
      y: Math.sin(phi) * Math.sin(theta) * speed,
      z: Math.cos(phi) * speed,
      life: 1.0,
      decay: Math.random() * 0.015 + 0.01
    });

    // Custom colors: transition sparks from cyan to pink
    const color = colorCyan.clone().lerp(colorPink, Math.random());
    sparkColors[i * 3 + 0] = color.r;
    sparkColors[i * 3 + 1] = color.g;
    sparkColors[i * 3 + 2] = color.b;
  }

  sparkGeometry.setAttribute('position', new THREE.BufferAttribute(sparkPositions, 3));
  sparkGeometry.setAttribute('color', new THREE.BufferAttribute(sparkColors, 3));

  const sparkMaterial = new THREE.PointsMaterial({
    size: 0.18,
    transparent: true,
    alphaMap: particleTexture,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const sparks = new THREE.Points(sparkGeometry, sparkMaterial);
  scene.add(sparks);

  explosionParticles.push({
    points: sparks,
    velocities: velocities,
    geometry: sparkGeometry,
    count: sparkCount
  });

  // Temporarily surge the starfield rotation speed using GSAP
  gsap.to(starfieldRotationSpeed, {
    value: 0.02,
    duration: 0.8,
    ease: 'power2.out',
    onComplete: () => {
      gsap.to(starfieldRotationSpeed, {
        value: 0.0015,
        duration: 2.0
      });
    }
  });
}

// Global Speed Tracker for galaxy rotation
const starfieldRotationSpeed = { value: 0.0015 };

// Listen for form submission from main.js
window.addEventListener('contact-submit', () => {
  triggerFormExplosion();
});

/* -------------------------------------------------------------
 * Interactivity: Mouse and Scroll Handlers
 * ------------------------------------------------------------- */
const mouse = { x: 0, y: 0 };
const targetMouse = { x: 0, y: 0 };

window.addEventListener('mousemove', (event) => {
  // Normalize cursor positions (-1 to 1)
  targetMouse.x = (event.clientX / sizes.width) * 2 - 1;
  targetMouse.y = -(event.clientY / sizes.height) * 2 + 1;
});

// Scroll coordinate interpolation
let scrollY = window.scrollY;
let targetScrollY = 0;
let currentScrollY = 0;

window.addEventListener('scroll', () => {
  scrollY = window.scrollY;
  // Express scroll relative to window heights
  targetScrollY = scrollY / sizes.height;
});

/* -------------------------------------------------------------
 * Resize Listener
 * ------------------------------------------------------------- */
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/* -------------------------------------------------------------
 * Core Animation loop (RAF)
 * ------------------------------------------------------------- */
const clock = new THREE.Clock();

function tick() {
  const elapsedTime = clock.getElapsedTime();

  // 1. Particle Nebula base rotation
  starfield.rotation.y = elapsedTime * starfieldRotationSpeed.value;
  starfield.rotation.x = elapsedTime * (starfieldRotationSpeed.value * 0.5);

  // 2. Mesh local rotations
  torusMesh.rotation.x = elapsedTime * 0.2;
  torusMesh.rotation.y = elapsedTime * 0.15;

  octahedronMesh.rotation.x = elapsedTime * 0.25;
  octahedronMesh.rotation.y = elapsedTime * 0.2;

  projectsSphereMesh.rotation.x = elapsedTime * 0.1;
  projectsSphereMesh.rotation.y = elapsedTime * 0.15;

  // 3. Smooth Lerp Scroll Camera Interpolation
  currentScrollY += (targetScrollY - currentScrollY) * 0.06;
  
  // Camera plunges vertically straight down through the starfield cylinder
  camera.position.y = -currentScrollY * 8;
  
  // 4. Mouse Tilting Camera Parallax (Responsive Lerping)
  mouse.x += (targetMouse.x - mouse.x) * 0.05;
  mouse.y += (targetMouse.y - mouse.y) * 0.05;

  camera.position.x = mouse.x * 1.5;
  // Offset camera Y slightly depending on mouse look
  camera.position.y += mouse.y * 0.8;

  // Update light coordinates based on mouse movement and camera vertical drop
  cyanPointLight.position.x = -6 + mouse.x * 2;
  cyanPointLight.position.y = 3 - currentScrollY * 8 + mouse.y * 2;
  pinkPointLight.position.x = 6 + mouse.x * 2;
  pinkPointLight.position.y = -3 - currentScrollY * 8 + mouse.y * 2;

  // 5. Update Explosion Sparks (if active)
  for (let e = explosionParticles.length - 1; e >= 0; e--) {
    const explosion = explosionParticles[e];
    const posAttr = explosion.points.geometry.attributes.position;
    const positionsArray = posAttr.array;
    let activeParticles = 0;

    for (let i = 0; i < explosion.count; i++) {
      const vel = explosion.velocities[i];
      if (vel.life > 0) {
        positionsArray[i * 3 + 0] += vel.x;
        positionsArray[i * 3 + 1] += vel.y;
        positionsArray[i * 3 + 2] += vel.z;

        // Apply friction and gravity
        vel.x *= 0.98;
        vel.y *= 0.98;
        vel.y -= 0.001; // subtle downward gravity drop
        vel.z *= 0.98;

        vel.life -= vel.decay;
        activeParticles++;
      }
    }

    posAttr.needsUpdate = true;

    // Fade transparency out as life decays
    explosion.points.material.opacity = Math.max(0, activeParticles / explosion.count);

    // Garbage collection of dead explosions
    if (activeParticles === 0) {
      scene.remove(explosion.points);
      explosion.points.geometry.dispose();
      explosion.points.material.dispose();
      explosionParticles.splice(e, 1);
    }
  }

  // Render frame
  renderer.render(scene, camera);

  // Next frame
  window.requestAnimationFrame(tick);
}

// Start loop
tick();

// Theme Change Event Listener to smoothly update WebGL lighting and atmospheres
window.addEventListener('theme-change', (event) => {
  const isLight = event.detail.theme === 'light';
  
  if (isLight) {
    // Light mode colors
    gsap.to(ambientLight.color, { r: 1.0, g: 1.0, b: 1.0, duration: 0.8 });
    gsap.to(cyanPointLight.color, { r: 0.0, g: 0.46, b: 1.0, duration: 0.8 }); // Royal Blue
    gsap.to(pinkPointLight.color, { r: 0.3, g: 0.0, b: 1.0, duration: 0.8 }); // Indigo
  } else {
    // Dark mode colors
    const darkAmbient = new THREE.Color('#040e2b');
    const darkCyan = new THREE.Color('#00d2ff');
    const darkPink = new THREE.Color('#4d00ff');
    
    gsap.to(ambientLight.color, { r: darkAmbient.r, g: darkAmbient.g, b: darkAmbient.b, duration: 0.8 });
    gsap.to(cyanPointLight.color, { r: darkCyan.r, g: darkCyan.g, b: darkCyan.b, duration: 0.8 });
    gsap.to(pinkPointLight.color, { r: darkPink.r, g: darkPink.g, b: darkPink.b, duration: 0.8 });
  }
});
