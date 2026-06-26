import { BrainViewer } from './brain/brain-viewer.js';
import {
  createBrainModelDescriptor,
  loadBrainModelBundle,
} from './brain/model-registry.js';
import {
  hideSelectionDetails,
  hideLoadingOverlay,
  renderAppShell,
  setLoadingProgress,
  updateSelectionDetails,
  updateSourceAttribution,
} from './ui/shell.js';

export async function mountApp(root) {
  const ui = renderAppShell(root);
  const descriptor = createBrainModelDescriptor();
  const bundle = await loadBrainModelBundle(descriptor);
  const viewer = new BrainViewer({
    canvas: ui.canvas,
    container: ui.viewerFrame,
    onSpotSelect: (selection) => updateSelectionDetails(ui, selection),
  });

  ui.selectionDismiss.addEventListener('click', () => {
    hideSelectionDetails(ui);
    viewer.clearSelection();
  });
  updateSourceAttribution(ui.sourceAttribution, bundle.source);
  hideSelectionDetails(ui);
  setLoadingProgress(ui, 0);
  await viewer.loadModel(bundle.model, {
    onProgress: (progressPercent) => setLoadingProgress(ui, progressPercent),
  });
  hideLoadingOverlay(ui);
  viewer.start();

  return viewer;
}
