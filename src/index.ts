import * as fs from 'fs';

import { Opts } from './interfaces';
import presets from './presets';

const validateMessage = function(message: string, options: Opts = {}): boolean {
  if (!message) {
    return false;
  }

  options = (<any>Object).assign({
    preset: 'angular'
  }, options);

  const preset = presets[options.preset];

  if (!preset) {
    throw new Error(`Preset '${options.preset}' does not exist. A preset must be provided`);
  }

  const {validate, ignorePattern} = preset;

  if (ignorePattern && ignorePattern.test(message)) {
    console.warn('Commit message validation ignored.');

    return true;
  }

  return validate(message);
};

const firstLineFromBuffer = function(buffer: Buffer): string {
  return buffer.toString().split('\n').shift();
};

const validateMessageFromFile = function(pathToFile: string) {
  const buffer = fs.readFileSync(pathToFile);
  const message = firstLineFromBuffer(buffer);

  return validateMessage(message);
};

export {
  validateMessage,
  validateMessageFromFile
};
