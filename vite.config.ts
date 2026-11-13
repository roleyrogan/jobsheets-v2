import path from 'path'
import type { Plugin } from 'vite'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const INSTRUMENT_LATIN_WDTH =
  'instrument-sans-latin-wdth-normal'

function preloadInstrumentSans(): Plugin {
  return {
    name: 'preload-instrument-sans',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        let href: string | undefined

        if (ctx.bundle) {
          for (const fileName of Object.keys(ctx.bundle)) {
            if (
              fileName.includes(INSTRUMENT_LATIN_WDTH) &&
              fileName.endsWith('.woff2') &&
              !fileName.includes('latin-ext')
            ) {
              href = `/${fileName}`
              break
            }
          }
        } else {
          href =
            '/node_modules/@fontsource-variable/instrument-sans/files/instrument-sans-latin-wdth-normal.woff2'
        }

        if (!href) return html

        return html.replace(
          '</title>',
          `</title>\n    <link rel="preload" as="font" type="font/woff2" href="${href}" crossorigin />`,
        )
      },
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), preloadInstrumentSans()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'node',
  },
})
