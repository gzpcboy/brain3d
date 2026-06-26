import { BrainViewer } from './brain/brain-viewer.js';
import {
  createBrainModelDescriptor,
  loadBrainModelBundle,
} from './brain/model-registry.js';
import {
  hideLoadingOverlay,
  renderAppShell,
  setLoadingProgress,
  updateSourceAttribution,
} from './ui/shell.js';

export async function mountApp(root) {
  const ui = renderAppShell(root);
  const descriptor = createBrainModelDescriptor();
  const bundle = await loadBrainModelBundle(descriptor);
  const viewer = new BrainViewer({
    canvas: ui.canvas,
    container: ui.viewerFrame,
  });

  updateSourceAttribution(ui.sourceAttribution, bundle.source);
  setLoadingProgress(ui, 0);
  await viewer.loadModel(bundle.model, {
    onProgress: (progressPercent) => setLoadingProgress(ui, progressPercent),
  });
  hideLoadingOverlay(ui);
  viewer.start();

  return viewer;
}
