import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages SPA 用の 404.html をビルド時に生成するプラグイン
// base 設定値を注入するため、ハードコードを避けられる
function spaFallback(): Plugin {
  let base: string
  return {
    name: 'spa-fallback-404',
    configResolved(config) {
      base = config.base
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: '404.html',
        source: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Redirecting...</title>
    <script>
      var basePath = ${JSON.stringify(base)};
      var pathAfterBase = location.pathname.slice(basePath.length);
      sessionStorage.setItem('spa-redirect', pathAfterBase + location.search);
      location.replace(basePath);
    </script>
  </head>
  <body></body>
</html>`,
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), spaFallback()],
  base: '/anarchy-reversi/',
})
