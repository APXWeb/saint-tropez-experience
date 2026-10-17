import { defineConfig } from 'vite'
import { pathToFileURL } from 'node:url'
import { resolve, join } from 'node:path'
import { existsSync, readdirSync, rmSync } from 'node:fs'

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

// og:image e og:url precisam ser URLs absolutas, senão WhatsApp e redes sociais ignoram a prévia.
// Em CI o endereço sai de GITHUB_REPOSITORY (https://<dono>.github.io/<repo>/), então o mesmo
// código serve a cópia de teste e a oficial. SITE_URL sobrescreve. Sem nenhum dos dois (build
// local), as tags ficam relativas, como antes.
function socialMeta() {
  const repo = process.env.GITHUB_REPOSITORY
  const raw = process.env.SITE_URL || (repo ? `https://${repo.split('/')[0].toLowerCase()}.github.io/${repo.split('/')[1]}/` : '')
  const site = raw && raw.replace(/\/?$/, '/')
  return {
    name: 'social-meta',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        if (!site || !ctx.bundle) return html
        const page = ctx.path.endsWith('cardapio.html') ? 'cardapio.html' : ''
        return html
          .replace(/(<meta property="og:image" content=")(?!https?:)([^"]+)"/, `$1${site}$2"`)
          .replace('</head>', `  <meta property="og:url" content="${site}${page}">
</head>`)
      },
    },
  }
}

// Os .json ao lado das fotos em public/img são a origem de cada imagem (tools/provenance.sh):
// ficam no repositório, mas não precisam ir para o site publicado.
function dropProvenance() {
  let out = ''
  return {
    name: 'drop-provenance',
    apply: 'build',
    configResolved(config) {
      out = resolve(config.root, config.build.outDir, 'img')
    },
    closeBundle() {
      if (!existsSync(out)) return
      for (const f of readdirSync(out)) if (f.endsWith('.json')) rmSync(join(out, f))
    },
  }
}

export default defineConfig({
  // Relative base: the build works at /, at /<repo>/ on GitHub Pages, or from any subfolder.
  base: './',
  plugins: [siteData(), preloadFonts(), socialMeta(), dropProvenance()],
  server: { port: 5190 },
  preview: { port: 4176 },
  build: {
    target: 'es2020',
    assetsInlineLimit: 0,
    rollupOptions: { input: { main: resolve('index.html'), cardapio: resolve('cardapio.html') } },
  },
})
