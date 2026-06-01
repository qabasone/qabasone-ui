import { defineConfig } from 'vite'
import path from 'path'
import { readFileSync } from 'node:fs'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

const pkg = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf-8'),
) as {
  dependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
}

const external = [
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.peerDependencies ?? {}),
  'react/jsx-runtime',
]

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
  build: {
  "lib": {
    "entry": [
      "./src/index.ts",
      "./src/ui/index.ts",
      "./src/ui/ChartTooltips.ts",
      "./src/ui/ConfirmModal.ts",
      "./src/ui/ContextMenu.ts",
      "./src/ui/EntityLink.ts",
      "./src/ui/Pagination.ts",
      "./src/ui/SearchableDropdowns.ts",
      "./src/ui/Toast.ts"
    ],
    "formats": [
      "es"
    ],
    "cssFileName": "style"
  },
  "rollupOptions": {
    "external": external,
    "output": {
      "preserveModules": true,
      "preserveModulesRoot": "src",
      "entryFileNames": "[name].js"
    }
  }
},
})
