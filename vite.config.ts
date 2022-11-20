import favicons from '@darkobits/vite-plugin-favicons'
import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'
import unpluginAutoImport from 'unplugin-auto-import/vite'
import unpluginIconsResolver from 'unplugin-icons/resolver'
import unpluginIcons from 'unplugin-icons/vite'
// @ts-ignore
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import solidPages from 'vite-plugin-pages'
import solidPlugin from 'vite-plugin-solid'
import solidSvg from 'vite-plugin-solid-svg'

import packageJSON from './package.json'

const pathLogoOrange = './src/assets/logoOrange.svg'
const pathLogoWhite = './src/assets/logoWhite.svg'

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

    unpluginIcons({ autoInstall: true, compiler: 'solid' }),

    unpluginAutoImport({
      imports: ['solid-js', '@solidjs/router'],
      dts: './src/auto-imports.d.ts',
      resolvers: [
        unpluginIconsResolver({
          prefix: 'Icon',
          extension: 'jsx',
        }),
      ],
    }),

    favicons({
      appName: packageJSON.name[0].toUpperCase() + packageJSON.name.slice(1),
      appDescription: packageJSON.description,
      start_url: '',
      cache: true,
      icons: {
        favicons: {
          source: pathLogoOrange,
        },
        android: {
          source: pathLogoWhite,
          background: '#ec7505',
          offset: 20,
        },
        appleIcon: {
          source: pathLogoWhite,
          background: '#ec7505',
          offset: 20,
        },
        appleStartup: {
          source: pathLogoWhite,
          background: '#ec7505',
          offset: 20,
        },
      },
    }),
  ],
  resolve: {
    alias: {
      '/src': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
  css: {
    postcss: {
      plugins: [autoprefixer(), tailwindcss()],
    },
  },
})
