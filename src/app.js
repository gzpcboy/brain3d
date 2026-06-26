import { BrainViewer } from './brain/brain-viewer.js';
import {
  createBrainModelDescriptor,
  loadBrainModelBundle,
} from './brain/model-registry.js';
import { renderAppShell, updateSource, updateStats, updateStatus } from './ui/shell.js';

export async function mountApp(root) {
  const ui = renderAppShell(root);
  const descriptor = createBrainModelDescriptor();
  const bundle = await loadBrainModelBundle(descriptor);
  const viewer = new BrainViewer({
    canvas: ui.canvas,
    container: ui.viewerFrame,
    onStatusChange: (value) => updateStatus(ui.statusLine, value),
    onStatsChange: (stats) => updateStats(ui.modelStats, stats),
  });

  updateSource(ui.sourceCopy, bundle.source);
  await viewer.loadModel(descriptor.meshPath, bundle.metadata);
  viewer.start();

  return viewer;
}

