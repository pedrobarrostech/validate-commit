/**
 * Git COMMIT-MSG hook for validating commit message
 * See https://docs.google.com/document/d/1rk04jEuGfk9kYzfqCuOlPTSJw3hEDZJTBN5E5f1SALo/edit
 *
 * Taken from https://github.com/angular/angular.js/blob/master/validate-commit-msg.js
 * and cleaned up a bit
 *
 * Thanks to the Angular team!
 */

import fs from 'fs';

import chalk from 'chalk';
import defaults from 'lodash.defaults';
import keys from 'lodash.keys';

import presets from './presets';

const LOG_LEVELS = {
    ERROR: {
        color: 'red'
    },
    WARN: {
        color: 'yellow'
    },
    INFO: {
        color: 'cyan'
    },
    DEBUG: {
        color: 'white'
    }
};

var opts = {
    preset: 'angular'
};

var log = function(message, severity) {
    var color = LOG_LEVELS[severity.toUpperCase()].color || 'cyan';

    /*eslint no-console: 0*/
    console.log(chalk[color](message));
};

var validateMessage = function(message = '', options = {}) {

    defaults(options, opts);

    var preset = presets[options.preset];

    if (!preset) {
        log(`Preset '${options.preset}' does not exist`, 'error');

        throw new Error('A preset must be provided');
    }

    if (preset.IGNORED.test(message)) {
        log('Commit message validation ignored.', 'warn');

        return true;
    }

    if (message.length > preset.MAX_LENGTH) {
        log(`Message is longer than ${preset.MAX_LENGTH} characters!`, 'error');

        return false;
    }

    var match = preset.PATTERN.exec(message);

    if (!match) {
        log(`Message does not match "<type>(<scope>): <subject>" ! was: ${message}`, 'error');

        return false;
    }

    var type = match[1];
    // in case they are needed
    // var scope = match[3];
    // var subject = match[4];

    if (!preset.TYPES.hasOwnProperty(type)) {
        log(`'${type}' is not an allowed type!`, 'error');
        log(`Valid types are: ${keys(preset.TYPES).join(', ')}`, 'info');

        return false;
    }

    // Some more ideas, do want anything like this ?
    // - allow only specific scopes (eg. fix(docs) should not be allowed ?
    // - auto correct the type to lower case ?
    // - auto correct first letter of the subject to lower case ?
    // - auto add empty line after subject ?
    // - auto remove empty () ?
    // - auto correct typos in type ?
    // - store incorrect messages, so that we can learn

    return true;
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
