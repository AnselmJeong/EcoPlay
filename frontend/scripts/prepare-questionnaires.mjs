import { cp, rm } from 'node:fs/promises';
import path from 'node:path';

const frontendRoot = process.cwd();
const sourceDirectory = path.resolve(frontendRoot, '..', 'questionnaire');
const targetDirectory = path.resolve(frontendRoot, 'questionnaire');

await rm(targetDirectory, { recursive: true, force: true });
await cp(sourceDirectory, targetDirectory, { recursive: true });
