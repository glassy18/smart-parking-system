// Simple dual-process launcher without external dependencies
const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Smart Parking System (Server + Client)...\n');

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

// Start Server
const server = spawn(npmCmd, ['--prefix', 'server', 'start'], {
  stdio: 'inherit',
  shell: true,
  cwd: __dirname
});

// Start Client
const client = spawn(npmCmd, ['--prefix', 'client', 'run', 'dev'], {
  stdio: 'inherit',
  shell: true,
  cwd: __dirname
});

function handleExit(code) {
  server.kill();
  client.kill();
  process.exit(code);
}

process.on('SIGINT', () => handleExit(0));
process.on('SIGTERM', () => handleExit(0));
