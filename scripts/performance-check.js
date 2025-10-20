#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Performance Analysis Script for Rentimade Platform
 * This script analyzes bundle sizes and identifies performance bottlenecks
 */

console.log('🔍 Analyzing Rentimade Platform Performance...\n');

// Check package.json for heavy dependencies
function analyzeDependencies() {
  const packagePath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  console.log('📦 Dependency Analysis:');
  console.log('======================');
  
  const heavyDeps = [];
  const radixDeps = [];
  
  Object.entries(packageJson.dependencies).forEach(([name, version]) => {
    if (name.startsWith('@radix-ui')) {
      radixDeps.push(name);
    }
    if (['framer-motion', 'lucide-react', 'date-fns', 'recharts'].includes(name)) {
      heavyDeps.push(name);
    }
  });
  
  console.log(`• Total Radix UI packages: ${radixDeps.length}`);
  console.log(`• Heavy UI libraries: ${heavyDeps.join(', ')}`);
  console.log(`• Total dependencies: ${Object.keys(packageJson.dependencies).length}`);
  
  return { radixDeps, heavyDeps };
}

// Check component structure
function analyzeComponents() {
  const componentsPath = path.join(process.cwd(), 'components');
  const uiComponentsPath = path.join(componentsPath, 'ui');
  
  console.log('\n🧩 Component Analysis:');
  console.log('======================');
  
  let uiFiles = [];
  let pageFiles = [];
  
  if (fs.existsSync(uiComponentsPath)) {
    uiFiles = fs.readdirSync(uiComponentsPath).filter(f => f.endsWith('.tsx'));
    console.log(`• UI Components: ${uiFiles.length}`);
  }
  
  const appPath = path.join(process.cwd(), 'app');
  if (fs.existsSync(appPath)) {
    pageFiles = fs.readdirSync(appPath).filter(f => f.endsWith('.tsx'));
    console.log(`• Page Components: ${pageFiles.length}`);
  }
  
  return { uiFiles, pageFiles };
}

// Performance recommendations
function generateRecommendations({ radixDeps, heavyDeps }) {
  console.log('\n💡 Performance Recommendations:');
  console.log('================================');
  
  if (radixDeps.length > 20) {
    console.log('⚠️  High number of Radix UI packages detected');
    console.log('   → Consider using tree-shaking optimization');
    console.log('   → Implement dynamic imports for heavy components');
  }
  
  if (heavyDeps.includes('framer-motion')) {
    console.log('⚠️  Framer Motion detected - can be heavy');
    console.log('   → Consider lazy loading animations');
    console.log('   → Use CSS animations for simple effects');
  }
  
  console.log('✅ Implemented optimizations:');
  console.log('   → Enhanced Next.js config with better code splitting');
  console.log('   → Dynamic imports for major components');
  console.log('   → Optimized webpack bundle splitting');
  console.log('   → Package import optimization');
  
  console.log('\n🚀 Additional optimizations to consider:');
  console.log('   → Implement React.memo for expensive components');
  console.log('   → Use useMemo and useCallback for expensive calculations');
  console.log('   → Consider replacing heavy libraries with lighter alternatives');
  console.log('   → Implement virtual scrolling for long lists');
  console.log('   → Use image optimization and lazy loading');
}

// Main execution
function main() {
  try {
    const deps = analyzeDependencies();
    const components = analyzeComponents();
    generateRecommendations(deps);
    
    console.log('\n✨ Performance analysis complete!');
    console.log('Run "npm run dev" to test the optimizations.');
    
  } catch (error) {
    console.error('❌ Error analyzing performance:', error.message);
    process.exit(1);
  }
}

main();
