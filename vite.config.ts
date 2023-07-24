import { faviconsPlugin as favicons } from '@darkobits/vite-plugin-favicons'
import autoprefixer from 'autoprefixer'
import {
  type PluginVisualizerOptions,
  visualizer,
} from 'rollup-plugin-visualizer'
import tailwindcss from 'tailwindcss'
import unpluginAutoImport from 'unplugin-auto-import/vite'
// @ts-ignore
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import solidPages from 'vite-plugin-pages'
import { VitePWA as pwa } from 'vite-plugin-pwa'
import solidPlugin from 'vite-plugin-solid'
import solidSvg from 'vite-plugin-solid-svg'

import packageJSON from './package.json'

const pathLogoOrange = './src/assets/svg/logoOrange.svg'
const pathLogoWhite = './src/assets/svg/logoWhite.svg'

const orange = '#ec7505'

export default defineConfig({
  plugins: [
    solidPlugin(),

    solidSvg(),

    solidPages({
      exclude: [
        '**/components/*',
        '**/components/**/*',
        '**/scripts/*',
        '**/scripts/**/*',
      ],
    }),

    unpluginAutoImport({
      imports: ['solid-js', '@solidjs/router'],
      dts: './src/auto-imports.d.ts',
    }),

    pwa({
      manifest: false,
      workbox: {
        skipWaiting: true,
      },
    }),

    favicons({
      appName: packageJSON.name,
      appDescription: packageJSON.description,
      start_url: '',
      cache: true,
      icons: {
        favicons: {
          source: pathLogoOrange,
        },
        android: {
          source: pathLogoWhite,
          background: orange,
          offset: 20,
        },
        appleIcon: {
          source: pathLogoWhite,
          background: orange,
          offset: 20,
        },
        appleStartup: {
          source: pathLogoWhite,
          background: orange,
          offset: 20,
        },
      },
    }),

    ...(
      [
        {
          template: 'treemap',
          filename: './docs/visualizer/treemap.html',
        },
        {
          template: 'network',
          filename: './docs/visualizer/network.html',
        },
        {
          template: 'sunburst',
          filename: './docs/visualizer/sunburst.html',
        },
      ] as PluginVisualizerOptions[]
    ).map((config) => visualizer(config)),
  ],
  resolve: {
    alias: {
      '/src': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'esnext',
  },
  server: {
    port: 3000,
    host: true,
  },
  preview: {
    port: 3000,
    host: true,
  },
  css: {
    postcss: {
      plugins: [autoprefixer(), tailwindcss()],
    },
  },
})
