import fs from 'fs';

import defaults from 'lodash.defaults';

import presets from './presets';

var opts = {
  preset: 'angular'
};

var validateMessage = function(message, options = {}) {
  if (!message) {
    return false;
  }

  defaults(options, opts);

  var preset = presets[options.preset];

  if (!preset) {
    throw new Error(`Preset '${options.preset}' does not exist. A preset must be provided`);
  }

  var {validate, ignorePattern} = preset;

  if (ignorePattern && ignorePattern.test(message)) {
    /*eslint no-console: 0*/
    console.warn('Commit message validation ignored.');

    return true;
  }

  return validate(message);
};

var firstLineFromBuffer = function(buffer) {
  return buffer.toString().split('\n').shift();
};

var validateMessageFromBuffer = function(message) {
  var buffer = fs.readFileSync(message);
  var msg = firstLineFromBuffer(buffer);

  return validateMessage(msg);
};

module.exports = {
  validateMessage,
  validateMessageFromBuffer
};
