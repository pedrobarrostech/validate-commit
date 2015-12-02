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
import util from 'util';
import chalk from 'chalk';

const MAX_LENGTH = 100;
const PATTERN = /^(?:fixup!\s*)?(\w*)(\(([\w\$\.\*/-]*)\))?\: (.*)$/;
const IGNORED = /^WIP\:/;
const TYPES = {
    feat: true,
    fix: true,
    docs: true,
    style: true,
    refactor: true,
    perf: true,
    test: true,
    chore: true,
    revert: true
};


var error = function() {
    // gitx does not display it
    // http://gitx.lighthouseapp.com/projects/17830/tickets/294-feature-display-hook-error-message-when-hook-fails
    // https://groups.google.com/group/gitx/browse_thread/thread/a03bcab60844b812
    console.error(chalk.red(`INVALID COMMIT MSG: ${util.format.apply(null, arguments)}`));
};

var firstLineFromBuffer = function(buffer) {
    return buffer.toString().split('\n').shift();
};

var validateMessage = function(message = '') {
    var subject = firstLineFromBuffer(message);
    var isValid = true;

    if (IGNORED.test(message)) {
        console.log(chalk.yellow('Commit message validation ignored.'));
        return true;
    }

    if (message.length > MAX_LENGTH) {
        error(`is longer than ${MAX_LENGTH} characters !`);
        isValid = false;
    }

    var match = PATTERN.exec(message);

    if (!match) {
        error(`does not match "<type>(<scope>): <subject>" ! was: ${message}`);
        return false;
    }

    var type = match[1];
    var scope = match[3];
    var subject = match[4];

    if (!TYPES.hasOwnProperty(type)) {
        error(`'${type}' is not an allowed type!`);
        console.log('Valid types are:', chalk.cyan(Object.keys(TYPES).join(', ')));
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

    return isValid;
};

module.exports = validateMessage;
