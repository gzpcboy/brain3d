import * as THREE from 'three';

export function createRenderer(canvas) {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    canvas,
  });

  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  return renderer;
}

export function createCamera(container) {
  const camera = new THREE.PerspectiveCamera(
    35,
    container.clientWidth / Math.max(container.clientHeight, 1),
    0.1,
    2000,
  );
  camera.position.set(0, 18, 285);
  return camera;
}

export function createScene(background) {
  const scene = new THREE.Scene();
  scene.background = null;
  return scene;
}

export function addLights(scene) {
  const ambient = new THREE.HemisphereLight('#dff8ff', '#09121a', 1.35);
  const key = new THREE.DirectionalLight('#ffffff', 1.8);
  const fill = new THREE.DirectionalLight('#78d8ff', 0.95);
  const rim = new THREE.DirectionalLight('#ffb089', 1.1);

  key.position.set(120, 80, 140);
  fill.position.set(-100, 40, 60);
  rim.position.set(20, -40, -120);

  scene.add(ambient, key, fill, rim);
}

export function createBrainMaterial() {
  return new THREE.MeshPhysicalMaterial({
    color: '#f6cbb9',
    roughness: 0.52,
    metalness: 0.02,
    clearcoat: 0.12,
    clearcoatRoughness: 0.65,
    sheen: 0.8,
    sheenColor: new THREE.Color('#fff2ea'),
    specularIntensity: 0.45,
  });
}

export function createSurfaceGlow({
  coreRadius = 4,
  haloRadius = 8,
  coreOpacity = 0.95,
  haloOpacity = 0.22,
} = {}) {
  const group = new THREE.Group();
  const core = new THREE.Mesh(
    new THREE.SphereGeometry(coreRadius, 20, 20),
    new THREE.MeshBasicMaterial({
      color: '#8df3d5',
      transparent: true,
      opacity: coreOpacity,
      depthWrite: false,
    }),
  );
  const halo = new THREE.Mesh(
    new THREE.SphereGeometry(haloRadius, 20, 20),
    new THREE.MeshBasicMaterial({
      color: '#c8fff2',
      transparent: true,
      opacity: haloOpacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );

  group.visible = false;
  group.renderOrder = 12;
  group.add(halo, core);
  return group;
}

export function centerAndScaleMesh(mesh) {
  const bounds = new THREE.Box3().setFromObject(mesh);
  const size = bounds.getSize(new THREE.Vector3());
  const center = bounds.getCenter(new THREE.Vector3());
  const maxDimension = Math.max(size.x, size.y, size.z);
  const targetSize = 180;
  const scale = targetSize / maxDimension;

  mesh.position.sub(center);
  mesh.scale.setScalar(scale);
  return { bounds, scale, size };
}
