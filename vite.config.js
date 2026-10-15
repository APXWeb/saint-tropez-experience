import { defineConfig } from 'vite'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

// Fills every {{key}} in index.html and cardapio.html from src/render.js, which reads src/data/site.js.
// The data is re-imported on each request so edits show up in dev without a restart.
function siteData() {
  const renderUrl = pathToFileURL(resolve('src/render.js')).href
  return {
    name: 'site-data',
    transformIndexHtml: {
      order: 'pre',
      async handler(html) {
        const { blocks } = await import(`${renderUrl}?t=${Date.now()}`)
        const map = blocks()
        return html.replace(/\{\{([\w-]+)\}\}/g, (_, key) => {
          if (!(key in map)) throw new Error(`index.html usa {{${key}}}, que não existe em src/render.js`)
          return map[key]
        })
      },
    },
    handleHotUpdate({ file, server }) {
      if (/src[\\/](data[\\/]|render\.js)/.test(file)) server.ws.send({ type: 'full-reload' })
    },
  }
}

// Preloads the two latin fonts the opening uses (Gloock for the title, Figtree for the copy),
// so the title is drawn in its real face on the first paint instead of swapping in later.
// The bundle only exists in build; in dev the fonts come from the CSS as usual.
function preloadFonts() {
  return {
    name: 'preload-fonts',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        if (!ctx.bundle) return html
        const files = Object.keys(ctx.bundle).filter((f) => /(gloock-latin-400|figtree-latin-wght)-normal-.*\.woff2$/.test(f))
        const tags = files.map((f) => `  <link rel="preload" as="font" type="font/woff2" href="./${f}" crossorigin>\n`).join('')
        return html.replace('</head>', `${tags}</head>`)
      },
    },
  }
}

export default defineConfig({
  // Relative base: the build works at /, at /<repo>/ on GitHub Pages, or from any subfolder.
  base: './',
  plugins: [siteData(), preloadFonts()],
  server: { port: 5190 },
  preview: { port: 4176 },
  build: {
    target: 'es2020',
    assetsInlineLimit: 0,
    rollupOptions: { input: { main: resolve('index.html'), cardapio: resolve('cardapio.html') } },
  },
})
