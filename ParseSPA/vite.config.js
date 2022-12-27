/** @type {import('vite').UserConfig} */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const inject = require('@rollup/plugin-inject')

// https://vitejs.dev/config/
export default defineConfig({
  // plugins: [vue()]
  resolve: {
    // Use our versions of Node modules.
    alias: {
      'fs': 'browserfs/dist/shims/fs.js',
      'buffer': 'browserfs/dist/shims/buffer.js',
      'path': 'browserfs/dist/shims/path.js',
      'processGlobal': 'browserfs/dist/shims/process.js',
      'bufferGlobal': 'browserfs/dist/shims/bufferGlobal.js',
      'bfsGlobal': require.resolve('browserfs')
    }
  },
  plugins: [vue(), inject({ BrowserFS: 'bfsGlobal', process: 'processGlobal', Buffer: 'bufferGlobal' })],
  module: {
    noParse: /browserfs\.js/
  }
})
