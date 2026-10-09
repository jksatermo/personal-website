import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { repositoryRoot } from './mongodb.js';

// Optional Linux/cloud fallback when fastdl.mongodb.org is unavailable.
// Docker verifies the image manifest and layer digests before extraction.
const image = 'mongo@sha256:9690b268c50317b2988a7f84f514a2cdcf4de6836e12c295b48f3a203731fce1';
const exec = promisify(execFile);
const directory = path.join(repositoryRoot, '.cache', 'mongodb-docker');
const binary = path.join(directory, 'mongod');
let container;

try {
  if (process.platform !== 'linux') {
    throw new Error('This optional Docker extraction helper is for Linux. Use npm run dev on macOS/Windows.');
  }
  await mkdir(directory, { recursive: true });
  console.log('Pulling the pinned official MongoDB 8.2.6 Docker image…');
  await exec('docker', ['pull', image]);
  container = (await exec('docker', ['create', image])).stdout.trim();
  await exec('docker', ['cp', `${container}:/usr/bin/mongod`, binary]);
  const version = (await exec(binary, ['--version'])).stdout;
  if (!version.includes('db version v8.2.6')) throw new Error('The extracted MongoDB version does not match 8.2.6.');
  const sha256 = createHash('sha256').update(await readFile(binary)).digest('hex');
  await writeFile(path.join(directory, 'provenance.json'), `${JSON.stringify({ image, version: '8.2.6', sha256 }, null, 2)}\n`);
  console.log('Verified official MongoDB binary cached. npm run dev and npm test will use it automatically.');
} catch (error) {
  console.error(`Unable to prepare MongoDB: ${error.message}`);
  process.exitCode = 1;
} finally {
  if (container) await exec('docker', ['rm', container]);
}
