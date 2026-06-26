export function renderAppShell(root) {
  root.innerHTML = `
    <div class="page-shell">
      <div class="page-backdrop page-backdrop-a"></div>
      <div class="page-backdrop page-backdrop-b"></div>
      <main class="viewer-frame" data-testid="viewer-frame">
        <canvas id="brain-canvas" aria-label="3D brain viewer"></canvas>
        <aside class="source-attribution" data-testid="source-attribution" aria-label="Source attribution">
          <p class="source-attribution-copy" data-testid="source-attribution-copy"></p>
        </aside>
        <section
          class="selection-card is-hidden"
          data-testid="selection-card"
          aria-live="polite"
          aria-hidden="true"
        >
          <div class="selection-card-body">
            <button
              type="button"
              class="selection-dismiss"
              data-testid="selection-dismiss"
              aria-label="Dismiss neurotransmitter overlay"
            >
              ×
            </button>
            <p class="selection-kicker">Approximate neurotransmitters</p>
            <h2 class="selection-title" data-testid="selection-title"></h2>
            <p class="selection-summary" data-testid="selection-summary"></p>
            <ul class="selection-list" data-testid="selection-list"></ul>
            <p class="selection-note" data-testid="selection-note"></p>
          </div>
        </section>
        <section class="loading-overlay" data-testid="loading-overlay" aria-live="polite">
          <div class="loading-card">
            <p class="loading-label" data-testid="loading-label">Loading full brain 0%</p>
            <div class="progress-track" aria-hidden="true">
              <div class="progress-bar" data-testid="loading-bar"></div>
            </div>
          </div>
        </section>
      </main>
    </div>
  `;

  return {
    canvas: root.querySelector('#brain-canvas'),
    viewerFrame: root.querySelector('[data-testid="viewer-frame"]'),
    sourceAttribution: root.querySelector('[data-testid="source-attribution-copy"]'),
    selectionCard: root.querySelector('[data-testid="selection-card"]'),
    selectionDismiss: root.querySelector('[data-testid="selection-dismiss"]'),
    selectionTitle: root.querySelector('[data-testid="selection-title"]'),
    selectionSummary: root.querySelector('[data-testid="selection-summary"]'),
    selectionList: root.querySelector('[data-testid="selection-list"]'),
    selectionNote: root.querySelector('[data-testid="selection-note"]'),
    loadingOverlay: root.querySelector('[data-testid="loading-overlay"]'),
    loadingLabel: root.querySelector('[data-testid="loading-label"]'),
    loadingBar: root.querySelector('[data-testid="loading-bar"]'),
  };
}

export function updateSourceAttribution(node, source) {
  node.replaceChildren();

  const prefix = document.createElement('span');
  prefix.textContent = `${source.title} by ${source.authors.join(', ')} · `;

  const repositoryLink = document.createElement('a');
  repositoryLink.href = source.sourceRepository;
  repositoryLink.target = '_blank';
  repositoryLink.rel = 'noreferrer';
  repositoryLink.textContent = 'Repository';

  const separator = document.createElement('span');
  separator.textContent = ' · ';
  separator.setAttribute('aria-hidden', 'true');

  const licenseLink = document.createElement('a');
  licenseLink.href = source.licenseUrl;
  licenseLink.target = '_blank';
  licenseLink.rel = 'noreferrer';
  licenseLink.textContent = source.licenseName;

  node.append(prefix, repositoryLink, separator, licenseLink);
}

export function hideSelectionDetails(ui) {
  ui.selectionCard.classList.add('is-hidden');
  ui.selectionCard.setAttribute('aria-hidden', 'true');
  ui.selectionList.replaceChildren();
  ui.selectionTitle.textContent = '';
  ui.selectionSummary.textContent = '';
  ui.selectionNote.textContent = '';
}

export function updateSelectionDetails(ui, selection) {
  ui.selectionCard.classList.remove('is-hidden');
  ui.selectionCard.setAttribute('aria-hidden', 'false');
  ui.selectionTitle.textContent = selection.title;
  ui.selectionSummary.textContent = selection.summary;
  ui.selectionList.replaceChildren(
    ...selection.transmitters.map((transmitter) => {
      const item = document.createElement('li');
      item.className = 'selection-item';

      const name = document.createElement('strong');
      name.textContent = transmitter.name;

      const description = document.createElement('span');
      description.textContent = transmitter.description;

      item.append(name, description);
      return item;
    }),
  );
  ui.selectionNote.textContent = selection.note;
}

export function setLoadingProgress(ui, progressPercent) {
  const hasValue = Number.isFinite(progressPercent);
  const value = hasValue ? Math.max(0, Math.min(100, Math.round(progressPercent))) : null;

  ui.loadingOverlay.classList.remove('is-hidden');
  ui.loadingOverlay.removeAttribute('aria-hidden');
  ui.loadingOverlay.dataset.loadingState = hasValue ? 'determinate' : 'indeterminate';
  ui.loadingLabel.textContent = hasValue
    ? `Loading full brain ${value}%`
    : 'Loading full brain...';
  ui.loadingBar.style.transform = `scaleX(${hasValue ? value / 100 : 0.35})`;
}

export function hideLoadingOverlay(ui) {
  ui.loadingOverlay.classList.add('is-hidden');
  ui.loadingOverlay.setAttribute('aria-hidden', 'true');
}
