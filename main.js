import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.1/examples/jsm/controls/OrbitControls.js';

let scene, camera, renderer, controls;
let moveStep = 1;

init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 1.6, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.maxPolarAngle = Math.PI / 2;
  controls.target.set(0, 1.6, -1);

  const textureLoader = new THREE.TextureLoader();

  const wallTexture = textureLoader.load('hall1.jpg');
  const endWallTexture = textureLoader.load('hallend.jpg');
  const roomTexture = textureLoader.load('room.jpg');

  const blackMat = new THREE.MeshStandardMaterial({ color: 0x000000 });

  const wallMat = new THREE.MeshBasicMaterial({ map: wallTexture });
  const endMat = new THREE.MeshBasicMaterial({ map: endWallTexture });

  const hallway = new THREE.BoxGeometry(4, 4, 40);
  const hallwayMesh = new THREE.Mesh(hallway, [
    wallMat,       // right wall
    wallMat,       // left wall
    blackMat,      // ceiling
    blackMat,      // floor
    wallMat,       // front
    endMat         // back
  ]);
  hallwayMesh.position.z = -20;
  scene.add(hallwayMesh);

  const room = new THREE.Mesh(
    new THREE.BoxGeometry(4, 4, 4),
    new THREE.MeshBasicMaterial({ map: roomTexture })
  );
  room.position.set(-4, 0, -10);
  scene.add(room);

  const light = new THREE.PointLight(0xffffff, 1, 100);
  light.position.set(0, 4, 0);
  scene.add(light);

  document.getElementById('up').addEventListener('click', () => move(0, 0, -moveStep));
  document.getElementById('down').addEventListener('click', () => move(0, 0, moveStep));
  document.getElementById('left').addEventListener('click', () => move(-moveStep, 0, 0));
  document.getElementById('right').addEventListener('click', () => move(moveStep, 0, 0));

  window.addEventListener('resize', onWindowResize);
}

function move(x, y, z) {
  camera.position.x += x;
  camera.position.y += y;
  camera.position.z += z;
  controls.target.x += x;
  controls.target.y += y;
  controls.target.z += z;
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
