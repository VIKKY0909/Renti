import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ['res.cloudinary.com', 'hebbkx1anhila5yf.public.blob.vercel-storage.com'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  poweredByHeader: false,
  compress: true,
  swcMinify: true,
  reactStrictMode: false,
  
  // Enhanced Performance optimizations
  generateEtags: false,
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  trailingSlash: false,
  
  // Enhanced experimental features for performance
  experimental: {
    optimizePackageImports: [
      'lucide-react', 
      '@radix-ui/react-icons',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-dialog',
      '@radix-ui/react-popover',
      '@radix-ui/react-tabs',
      '@radix-ui/react-select',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-radio-group',
      '@radix-ui/react-switch',
      '@radix-ui/react-slider',
      '@radix-ui/react-progress',
      '@radix-ui/react-avatar',
      '@radix-ui/react-badge',
      '@radix-ui/react-separator',
      '@radix-ui/react-label',
      '@radix-ui/react-tooltip',
      '@radix-ui/react-toast',
      '@radix-ui/react-alert-dialog',
      '@radix-ui/react-hover-card',
      '@radix-ui/react-accordion',
      '@radix-ui/react-collapsible',
      '@radix-ui/react-navigation-menu',
      '@radix-ui/react-scroll-area',
      '@radix-ui/react-toggle',
      '@radix-ui/react-toggle-group',
      '@radix-ui/react-menubar',
      '@radix-ui/react-context-menu',
      '@radix-ui/react-aspect-ratio',
      'framer-motion',
      'date-fns'
    ],
    optimizeCss: true,
    webpackBuildWorker: true,
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  
  // Enhanced webpack optimization
  webpack: (config, { dev, isServer }) => {
    // Better code splitting for production
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          // Separate Radix UI components
          radix: {
            test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
            name: 'radix-ui',
            chunks: 'all',
            priority: 20,
          },
          // Separate other UI libraries
          ui: {
            test: /[\\/]node_modules[\\/](lucide-react|framer-motion|class-variance-authority|cmdk)[\\/]/,
            name: 'ui-libs',
            chunks: 'all',
            priority: 15,
          },
          // Separate utility libraries
          utils: {
            test: /[\\/]node_modules[\\/](clsx|tailwind-merge|date-fns|zod)[\\/]/,
            name: 'utils',
            chunks: 'all',
            priority: 10,
          },
          // Default vendor chunk
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 5,
          },
        },
      }
    }
    
    // Optimize module resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
    }
    
    return config
  },
}

export default nextConfig
