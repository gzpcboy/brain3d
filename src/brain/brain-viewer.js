import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { VIEWER_SETTINGS } from '../config.js';
import {
  addLights,
  centerAndScaleMesh,
  createBrainMaterial,
  createCamera,
  createRenderer,
  createScene,
} from './brain-scene.js';

export class BrainViewer {
  constructor({
    canvas,
    container,
    onStatusChange,
    onStatsChange,
  }) {
    this.canvas = canvas;
    this.container = container;
    this.onStatusChange = onStatusChange;
    this.onStatsChange = onStatsChange;
    this.scene = createScene(VIEWER_SETTINGS.background);
    this.camera = createCamera(container);
    this.renderer = createRenderer(canvas);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.loader = new STLLoader();
    this.startTime = performance.now();
    this.mesh = null;
    this.frameId = 0;

    addLights(this.scene);
    this.configureControls();
    this.resize();
    this.handleResize = () => this.resize();
    window.addEventListener('resize', this.handleResize);
  }

  configureControls() {
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.rotateSpeed = 0.8;
    this.controls.zoomSpeed = 1.1;
    this.controls.enablePan = false;
    this.controls.minDistance = VIEWER_SETTINGS.minDistance;
    this.controls.maxDistance = VIEWER_SETTINGS.maxDistance;
    this.controls.minPolarAngle = VIEWER_SETTINGS.polarAngleMin;
    this.controls.maxPolarAngle = VIEWER_SETTINGS.polarAngleMax;
    this.controls.target.set(0, 0, 0);
    this.controls.update();
  }

  async loadModel(meshPath, metadata) {
    this.onStatusChange('Loading PittBrains3D mesh…');
    const geometry = await this.loader.loadAsync(meshPath);

    geometry.computeVertexNormals();
    geometry.center();

    const material = createBrainMaterial();
    const mesh = new THREE.Mesh(geometry, material);
    const { size, scale } = centerAndScaleMesh(mesh);
    mesh.rotation.x = -0.14;
    mesh.rotation.y = 0.38;

    this.scene.add(mesh);
    this.mesh = mesh;
    this.onStatsChange({
      reducedTriangles: metadata.reducedTriangleCount,
      originalTriangles: metadata.originalTriangleCount,
      reductionRatio: metadata.reductionRatio,
      stride: metadata.stride,
      width: Math.round(size.x * scale),
      height: Math.round(size.y * scale),
      depth: Math.round(size.z * scale),
    });
    this.onStatusChange('Rotate, zoom, and inspect. Region-aware interactions can be layered on next.');
  }

  resize() {
    const width = Math.max(this.container.clientWidth, 1);
    const height = Math.max(this.container.clientHeight, 1);

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  start() {
    const tick = () => {
      this.frameId = window.requestAnimationFrame(tick);
      const elapsed = (performance.now() - this.startTime) / 1000;

      if (this.mesh) {
        this.mesh.rotation.z = Math.sin(elapsed * 0.35) * 0.02;
      }

      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    };

    tick();
  }

  dispose() {
    window.cancelAnimationFrame(this.frameId);
    window.removeEventListener('resize', this.handleResize);
    this.controls.dispose();
    this.renderer.dispose();
  }
}

