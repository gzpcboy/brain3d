import { HERO_METRICS } from '../config.js';
import { formatVersionLabel } from '../version.js';

export function renderAppShell(root) {
  root.innerHTML = `
    <div class="page-shell">
      <div class="page-backdrop page-backdrop-a"></div>
      <div class="page-backdrop page-backdrop-b"></div>
      <header class="topbar">
        <div>
          <p class="eyebrow">Interactive Neuroanatomy Viewer</p>
          <h1>Brain3D</h1>
        </div>
        <div class="version-pill" data-testid="version-pill">${formatVersionLabel()}</div>
      </header>

      <main class="hero-grid">
        <section class="hero-copy glass-panel">
          <p class="kicker">Built from PittBrains3D source data</p>
          <h2>Explore a tactile 3D brain with smooth orbit and zoom across desktop and touch.</h2>
          <p class="hero-text">
            This first release focuses on a fast, elegant whole-brain viewer. The module layout
            is prepared for later additions like double-click, long-press, and region-specific
            information overlays.
          </p>
          <div class="metric-row">
            ${HERO_METRICS.map(
              (metric) => `
                <article class="metric-card">
                  <span>${metric.label}</span>
                  <strong>${metric.value}</strong>
                </article>
              `,
            ).join('')}
          </div>
          <p class="status-line" data-testid="status-line">Booting viewer…</p>
        </section>

        <section class="viewer-panel glass-panel">
          <div class="viewer-frame" data-testid="viewer-frame">
            <canvas id="brain-canvas" aria-label="3D brain viewer"></canvas>
            <div class="viewer-hud">
              <div class="hud-chip">Drag to rotate</div>
              <div class="hud-chip">Pinch or wheel to zoom</div>
            </div>
          </div>
        </section>
      </main>

      <section class="info-grid">
        <article class="glass-panel info-card">
          <h3>Model Details</h3>
          <dl class="info-list" data-testid="model-stats"></dl>
        </article>
        <article class="glass-panel info-card">
          <h3>Source + License</h3>
          <div class="source-copy" data-testid="source-copy"></div>
        </article>
      </section>
    </div>
  `;

  return {
    canvas: root.querySelector('#brain-canvas'),
    viewerFrame: root.querySelector('[data-testid="viewer-frame"]'),
    statusLine: root.querySelector('[data-testid="status-line"]'),
    modelStats: root.querySelector('[data-testid="model-stats"]'),
    sourceCopy: root.querySelector('[data-testid="source-copy"]'),
  };
}

export function updateStatus(node, value) {
  node.textContent = value;
}

export function updateStats(node, stats) {
  const entries = [
    ['Original triangles', stats.originalTriangles?.toLocaleString() ?? 'Unknown'],
    ['Reduced triangles', stats.reducedTriangles?.toLocaleString() ?? 'Unknown'],
    ['Reduction', stats.reductionRatio ?? 'Unknown'],
    ['Stride', stats.stride ? `1 of ${stats.stride}` : 'Unknown'],
    ['Display size', `${stats.width} × ${stats.height} × ${stats.depth}`],
  ];

  node.innerHTML = entries
    .map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`)
    .join('');
}

export function updateSource(node, source) {
  node.innerHTML = `
    <p>${source.title}</p>
    <p>By ${source.authors.join(' and ')}</p>
    <p>${source.sourceNotes}</p>
    <p>
      <a href="${source.sourceRepository}" target="_blank" rel="noreferrer">Repository</a>
      <span aria-hidden="true"> · </span>
      <a href="${source.licenseUrl}" target="_blank" rel="noreferrer">${source.licenseName}</a>
    </p>
  `;
}

