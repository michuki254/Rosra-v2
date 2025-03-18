#!/usr/bin/env node

/**
 * Optimized build script for Next.js
 * 
 * This script runs the Next.js build with optimized settings:
 * - Increased memory allocation
 * - Production mode
 * - Disabled telemetry
 * - Parallel processing
 */

const { execSync } = require('child_process');
const os = require('os');

// Get number of CPU cores for parallel processing
const cpuCount = os.cpus().length;

// Calculate memory allocation (75% of system memory, max 8GB)
const systemMemory = os.totalmem() / (1024 * 1024 * 1024); // in GB
const memoryToAllocate = Math.min(Math.floor(systemMemory * 0.75), 8);

console.log(`🚀 Starting optimized build with ${cpuCount} CPU cores and ${memoryToAllocate}GB memory allocation`);

// Set environment variables
process.env.NODE_ENV = 'production';
process.env.NEXT_TELEMETRY_DISABLED = '1';

try {
  // Run the build with optimized settings
  execSync(
    `cross-env NODE_OPTIONS="--max-old-space-size=${memoryToAllocate * 1024}" next build`,
    { stdio: 'inherit' }
  );
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} 