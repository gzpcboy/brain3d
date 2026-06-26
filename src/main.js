import './styles.css';
import { mountApp } from './app.js';

const root = document.querySelector('#app');

mountApp(root).catch((error) => {
  console.error(error);
  root.innerHTML = `
    <main class="error-shell">
      <p class="eyebrow">Brain3D</p>
      <h1>Viewer failed to load</h1>
      <p>${error.message}</p>
    </main>
  `;
});

