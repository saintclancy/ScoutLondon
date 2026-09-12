# Scout London

A responsive, static personal pinboard. No build step or dependencies.

## Preview

Run `node server.cjs`, then open http://127.0.0.1:4173.

## GitHub Pages

The `dist` directory is the complete website. All application paths are relative so repository Pages URLs work. Push this project to your GitHub repository, select GitHub Actions in Settings → Pages, and manually run the Deploy Scout London to GitHub Pages workflow after reviewing the preview. Nothing publishes automatically.

Edit sample content in `dist/index.html` and photo captions in `dist/app.js`. The music link searches YouTube; there is no audio autoplay or embedded player. The mood preference stays in this browser. Fonts use Google Fonts with local fallbacks.
