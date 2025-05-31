// HTML에서 console 로그 제거하는 Vite 플러그인
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// HTML console 로그 제거 플러그인
function removeConsoleFromHTML() {
  return {
    name: 'remove-console-from-html',
    generateBundle(options, bundle) {
      // HTML 파일에서 console 로그 제거
      Object.keys(bundle).forEach(fileName => {
        if (fileName.endsWith('.html')) {
          const htmlBundle = bundle[fileName];
          if (htmlBundle.source) {
            // console.log 라인 완전 제거
            htmlBundle.source = htmlBundle.source
              .replace(/console\.log\([^)]*\);?\s*/g, '')
              .replace(/console\.error\([^)]*\);?\s*/g, '')
              .replace(/console\.warn\([^)]*\);?\s*/g, '')
              .replace(/console\.info\([^)]*\);?\s*/g, '')
              .replace(/console\.debug\([^)]*\);?\s*/g, '');
          }
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [
    react(),
    removeConsoleFromHTML()
  ],
  build: {
    outDir: 'dist',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          firebase: ['firebase/app', 'firebase/database']
        },
        // 캐시 버스팅을 위한 파일명에 해시 추가
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const extType = info[info.length - 1];
          if (/\.(css)$/.test(assetInfo.name)) {
            return `assets/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        }
      }
    },
    terserOptions: {
      compress: {
        drop_console: true, // 🔥 production에서 console.* 제거
        drop_debugger: true // debugger 문도 제거
      },
      format: {
        comments: false // 주석도 제거
      }
    }
  },
  server: {
    port: 3000,
    host: true
  },
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production')
  }
})
