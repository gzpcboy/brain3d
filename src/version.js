export const APP_VERSION =
  typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '0.0.0-dev';
export const BUILD_DATE =
  typeof __BUILD_DATE__ !== 'undefined' ? __BUILD_DATE__ : '1970-01-01T00:00:00.000Z';

export function formatVersionLabel(version = APP_VERSION) {
  return `Version ${version}`;
}

