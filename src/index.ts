import * as fs from 'fs';

import { Opts } from './interfaces';
import presets from './presets';

const validateMessage = function(message: string, options: Opts = {}): boolean {
  if (!message) {
    return false;
  }

  message = message.trim();

  options = (<any>Object).assign({
    preset: 'angular'
  }, options);

  const preset = presets[options.preset];

  if (!preset) {
    throw new Error(`Preset '${options.preset}' does not exist. A preset must be provided`);
  }

  const {validate, ignorePattern} = preset;

  if (ignorePattern && ignorePattern.test(message)) {
    if (process.env.SILENT === 'true' || !process.env.SILENT) {
      console.warn('Commit message validation ignored.');
    }

    return true;
  }

  return validate(message);
};

const getMessageFromBuffer = function(buffer: Buffer): string {
  return buffer.toString();
};

const validateMessageFromFile = function(file: string, options: Opts = {}) {
  const buffer = fs.readFileSync(file);
  const message = getMessageFromBuffer(buffer);

  return validateMessage(message, options);
};

export {
  validateMessage,
  validateMessageFromFile
};
