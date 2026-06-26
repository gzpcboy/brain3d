import './styles.css';
import { mountApp } from './app.js';

const root = document.querySelector('#app');

function renderBootError(node, error) {
  if (!node) {
    console.error('Missing #app root element');
    return;
  }

  node.replaceChildren();

  const shell = document.createElement('main');
  shell.className = 'error-shell';

  const eyebrow = document.createElement('p');
  eyebrow.className = 'eyebrow';
  eyebrow.textContent = 'Brain3D';

  const heading = document.createElement('h1');
  heading.textContent = 'Viewer failed to load';

  const details = document.createElement('p');
  details.textContent = error instanceof Error ? error.message : String(error);

  shell.append(eyebrow, heading, details);
  node.append(shell);
}

mountApp(root).catch((error) => {
  console.error(error);
  renderBootError(root, error);
});
