import 'dotenv/config';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';
import { startLocalMongo, repositoryRoot } from './mongodb.js';

const children = [];
let mongo;
let stopping = false;

async function stop(exitCode = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of children) {
    if (child.exitCode === null) child.kill('SIGTERM');
  }
  await Promise.all(children.map((child) => new Promise((resolve) => {
    if (child.exitCode !== null) return resolve();
    const timeout = setTimeout(() => { child.kill('SIGKILL'); resolve(); }, 5000);
    child.once('exit', () => { clearTimeout(timeout); resolve(); });
  })));
  if (mongo) await mongo.stop({ doCleanup: false, force: true });
  process.exit(exitCode);
}

function launch(command, args, env, cwd = repositoryRoot) {
  const child = spawn(command, args, { cwd, env, stdio: 'inherit' });
  children.push(child);
  child.once('error', () => {
    console.error(`Unable to launch ${command}.`);
    void stop(1);
  });
  child.once('exit', (code, signal) => {
    if (!stopping) void stop(signal ? 1 : (code || 0));
  });
}

process.once('SIGINT', () => void stop());
process.once('SIGTERM', () => void stop());

try {
  let uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('Starting local MongoDB (the first run downloads a verified MongoDB binary)…');
    mongo = await startLocalMongo({ persistent: true });
    uri = mongo.getUri('personal_website');
    console.log('Local MongoDB ready. Data is stored in .data/mongodb.');
  }
  const env = { ...process.env, MONGODB_URI: uri, NODE_ENV: 'development' };
  launch(process.execPath, ['--watch', 'server/index.js'], env);
  const clientDirectory = path.join(repositoryRoot, 'client');
  const clientRequire = createRequire(path.join(clientDirectory, 'package.json'));
  const viteBinary = path.join(path.dirname(clientRequire.resolve('vite/package.json')), 'bin', 'vite.js');
  launch(process.execPath, [viteBinary, '--host', '0.0.0.0'], env, clientDirectory);
} catch (error) {
  console.error(`Development startup failed (${error.name}). Check MongoDB availability and the setup instructions.`);
  await stop(1);
}
