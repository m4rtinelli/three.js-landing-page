import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

// Adicionar evento de carregamento para o window.onload
window.onload = function () {
  // Ocultar a tela de carregamento
  const loadingScreen = (document.getElementById(
    "loadingScreen"
  ).style.display = "none");

  const contentContainer = (document.querySelector(".container").style.display =
    "block");

  const loadingText = document.getElementById("loadingText");
  loadingText.style.opacity = "0";

  setTimeout(function () {
    loadingText.style.display = "none";
  }, 500);
};

//textures

const loader = new THREE.TextureLoader();
const texture = loader.load("/textures/montain-texture.jpg");
const height = loader.load("/textures/height.png");
const alpha = loader.load("/textures/alpha.png");
/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Lights
 */
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);

// ambientLight.position.set(8, 7, 5);
// scene.add(ambientLight);

const pointLight = new THREE.PointLight(0x04ae7b, 1.5);
pointLight.position.x = 8;
pointLight.position.y = 7;
pointLight.position.z = 5;
scene.add(pointLight);

const col = { color: "#00ff00" };
gui.addColor(col, "color").onChange(() => {
  pointLight.color.set(col.color);
});
/**
 * Objects
 */

// Material
const material = new THREE.MeshStandardMaterial({
  color: "#ffffff",
  map: texture,
  displacementMap: height,
  displacementScale: 0.6,
  alphaMap: alpha,
  transparent: true,
});

gui.add(material, "wireframe");

// Objects

const plane = new THREE.Mesh(new THREE.PlaneGeometry(4, 4, 64, 64), material);
plane.rotation.x = 5.06;

scene.add(plane);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth * 0.7,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth * 0.7;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 3;
scene.add(camera);

// Controls

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
document.addEventListener("mousemove", animateTerrain);
let mouseY = 0;

function animateTerrain(e) {
  mouseY = e.clientY;
}

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  plane.rotation.z = 0.5 * elapsedTime;
  plane.material.displacementScale = 0.35 + mouseY * 0.0008;

  // Update controls

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
