# Brain3D

Interactive 3D brain viewer built as a standalone site for `brain3d.gzpcboy.vip`.

## Features

- Uses PittBrains3D whole-brain source data with attribution
- Orbit rotation and wheel/pinch zoom via Three.js
- Modular browser code with each JS file under 500 lines
- Version badge in the UI to confirm deployments
- Unit tests, Playwright e2e coverage, and a local `deploy.sh`

## Quick start

```bash
npm install
npm run build
npm run dev
```

## Production-ish local deploy

```bash
./deploy.sh
```

That builds the site, prepares the reduced browser mesh, and restarts the local static server on `127.0.0.1:4317`.

## Source model

The browser mesh is derived from the PittBrains3D whole-brain STL:

- Repository: <https://github.com/PittBrains3D/PittBrains3D---Digital-3D-Models-for-Neuroanatomy-Instruction>
- License: CC BY-SA 4.0

