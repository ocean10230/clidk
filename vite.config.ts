import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { resolve  } from 'path'

const yes = (id:string) => {
  if (id === "react-router-dom")
    return "router-dom"
  else if (id.includes("react-dom"))
    return "framework-dom"
  if (id.includes("router"))
    return "router"
  else if (id.includes("toast"))
    return "notification"
  else if (id.includes("react"))
    return "react"
  else if (id.includes("tailwind"))
    return "tailwind"
  else if (id.includes("framer"))
    return "motion"
  else if (id.includes("dom"))
    return "dom"
  else if (id.includes("lucide"))
    return "lucide"
  else if (id.includes("zustand"))
    return "zustand"
  else 
    return "vendor"
}

const dir = __dirname

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        assetFileNames: "assets/[name].[ext]",
        
        manualChunks(id) {
          if (id.includes("node_modules"))
            return "lib/" + yes(id)
          else if (id.includes("page"))
            return "page/" + id.split("/").at(-1)
        },
      },
    },
  },
  
  resolve: {
    alias: {
      "@": resolve(dir, 'src'),
      "@components": resolve(dir, 'src', 'components'),
      "@upgrades": resolve(dir, 'src', 'upgrades')
    }
  },

  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss()
  ],
})
