import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import {
  addLights,
  centerAndScaleMesh,
  createBrainMaterial,
  createCamera,
  createRenderer,
  createScene,
  createTouchGlow,
} from './brain-scene.js';
import { TOUCH_HOLD_DELAY_MS, VIEWER_SETTINGS } from '../config.js';

export class BrainViewer {
  constructor({ canvas, container }) {
    this.canvas = canvas;
    this.container = container;
    this.scene = createScene(VIEWER_SETTINGS.background);
    this.camera = createCamera(container);
    this.renderer = createRenderer(canvas);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.loader = new STLLoader();
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.material = createBrainMaterial();
    this.touchGlow = createTouchGlow();
    this.startTime = performance.now();
    this.mesh = null;
    this.activeModelId = '';
    this.loadRequestId = 0;
    this.frameId = 0;
    this.touchHoldTimer = 0;
    this.touchHoldPoint = null;
    this.touchAnchorPoint = null;
    this.touchIdentifier = null;

    addLights(this.scene);
    this.scene.add(this.touchGlow);
    this.configureControls();
    this.resize();
    this.handleResize = () => this.resize();
    this.handleTouchStart = (event) => this.onTouchStart(event);
    this.handleTouchMove = (event) => this.onTouchMove(event);
    this.handleTouchEnd = (event) => this.onTouchEnd(event);
    this.handleTouchCancel = () => this.cancelTouchGlow();
    window.addEventListener('resize', this.handleResize);
    this.renderer.domElement.addEventListener('touchstart', this.handleTouchStart, { passive: true });
    this.renderer.domElement.addEventListener('touchmove', this.handleTouchMove, { passive: true });
    this.renderer.domElement.addEventListener('touchend', this.handleTouchEnd, { passive: true });
    this.renderer.domElement.addEventListener('touchcancel', this.handleTouchCancel, { passive: true });
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

  clearMesh() {
    if (!this.mesh) {
      return;
    }

    this.scene.remove(this.mesh);
    this.mesh.geometry.dispose();
    this.mesh = null;
    this.activeModelId = '';
  }

  async loadModel(model, { onProgress } = {}) {
    const requestId = ++this.loadRequestId;

    if (this.mesh && this.activeModelId === model.id) {
      onProgress?.(100);
      return;
    }

    onProgress?.(0);
    const geometry = await this.loadGeometry(model.meshPath, onProgress);

    if (requestId !== this.loadRequestId) {
      geometry.dispose();
      return;
    }

    geometry.computeVertexNormals();
    geometry.center();
    this.clearMesh();

    const mesh = new THREE.Mesh(geometry, this.material);
    const { size, scale } = centerAndScaleMesh(mesh);
    mesh.rotation.x = -0.14;
    mesh.rotation.y = 0.38;

    this.scene.add(mesh);
    this.mesh = mesh;
    this.activeModelId = model.id;
    this.lastStats = this.buildStats(model, size, scale);
    onProgress?.(100);
  }

  async loadGeometry(meshPath, onProgress) {
    return new Promise((resolve, reject) => {
      this.loader.load(
        meshPath,
        (geometry) => resolve(geometry),
        (event) => {
          if (!onProgress) {
            return;
          }

          if (event.total > 0) {
            onProgress((event.loaded / event.total) * 100);
            return;
          }

          onProgress(null);
        },
        (error) => reject(error),
      );
    });
  }

  buildStats(model, size = null, scale = null) {
    const dimensions = size && scale
      ? {
          width: Math.round(size.x * scale),
          height: Math.round(size.y * scale),
          depth: Math.round(size.z * scale),
        }
      : {};

    return {
      label: model.label,
      reducedTriangles: model.reducedTriangleCount,
      originalTriangles: model.originalTriangleCount,
      reductionRatio: model.reductionRatio,
      reductionPercent: model.reductionPercent,
      stride: model.stride,
      meshPath: model.meshPath,
      ...dimensions,
    };
  }

  onTouchStart(event) {
    if (event.touches.length !== 1) {
      this.cancelTouchGlow();
      return;
    }

    const touch = event.touches[0];
    this.touchIdentifier = touch.identifier;
    this.touchAnchorPoint = { x: touch.clientX, y: touch.clientY };
    this.touchHoldPoint = { x: touch.clientX, y: touch.clientY };
    this.touchGlow.visible = false;
    window.clearTimeout(this.touchHoldTimer);
    this.touchHoldTimer = window.setTimeout(() => this.showTouchGlow(), TOUCH_HOLD_DELAY_MS);
  }

  onTouchMove(event) {
    const touch = this.findTrackedTouch(event.touches);

    if (!touch || !this.touchAnchorPoint) {
      this.cancelTouchGlow();
      return;
    }

    this.touchHoldPoint = { x: touch.clientX, y: touch.clientY };
    const distance = Math.hypot(
      touch.clientX - this.touchAnchorPoint.x,
      touch.clientY - this.touchAnchorPoint.y,
    );

    if (distance > 12) {
      this.cancelTouchGlow();
      return;
    }

    if (this.touchGlow.visible) {
      this.positionTouchGlow(this.touchHoldPoint);
    }
  }

  onTouchEnd(event) {
    if (this.findTrackedTouch(event.touches)) {
      return;
    }

    this.cancelTouchGlow();
  }

  findTrackedTouch(touchList) {
    return Array.from(touchList).find((touch) => touch.identifier === this.touchIdentifier) || null;
  }

  showTouchGlow() {
    if (!this.touchHoldPoint) {
      return;
    }

    this.positionTouchGlow(this.touchHoldPoint);
  }

  positionTouchGlow(point) {
    if (!this.mesh) {
      return;
    }

    const hit = this.intersectPoint(point.x, point.y);

    if (!hit) {
      this.touchGlow.visible = false;
      return;
    }

    const normal = hit.face?.normal?.clone() || new THREE.Vector3(0, 0, 1);
    normal.transformDirection(hit.object.matrixWorld);
    this.touchGlow.position.copy(hit.point).addScaledVector(normal, 3);
    this.touchGlow.visible = true;
  }

  intersectPoint(clientX, clientY) {
    const bounds = this.renderer.domElement.getBoundingClientRect();

    this.pointer.x = ((clientX - bounds.left) / bounds.width) * 2 - 1;
    this.pointer.y = -((clientY - bounds.top) / bounds.height) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, this.camera);

    return this.raycaster.intersectObject(this.mesh, false)[0] || null;
  }

  cancelTouchGlow() {
    window.clearTimeout(this.touchHoldTimer);
    this.touchHoldTimer = 0;
    this.touchIdentifier = null;
    this.touchAnchorPoint = null;
    this.touchHoldPoint = null;
    this.touchGlow.visible = false;
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

      if (this.touchGlow.visible) {
        const pulse = 1 + Math.sin(elapsed * 5.5) * 0.14;

        this.touchGlow.scale.setScalar(pulse);
        this.touchGlow.children[0].material.opacity = 0.18 + (Math.sin(elapsed * 5.5) + 1) * 0.06;
      }

      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    };

    tick();
  }

  dispose() {
    window.cancelAnimationFrame(this.frameId);
    window.removeEventListener('resize', this.handleResize);
    this.renderer.domElement.removeEventListener('touchstart', this.handleTouchStart);
    this.renderer.domElement.removeEventListener('touchmove', this.handleTouchMove);
    this.renderer.domElement.removeEventListener('touchend', this.handleTouchEnd);
    this.renderer.domElement.removeEventListener('touchcancel', this.handleTouchCancel);
    this.cancelTouchGlow();
    this.controls.dispose();
    this.clearMesh();
    this.touchGlow.children.forEach((child) => {
      child.geometry.dispose();
      child.material.dispose();
    });
    this.material.dispose();
    this.renderer.dispose();
  }
}
