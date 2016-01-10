import chalk from 'chalk';

import keys from 'lodash.keys';

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

var log = function(message, severity) {
  var color = LOG_LEVELS[severity.toUpperCase()].color || 'cyan';

  /*eslint no-console: 0*/
  console.log(chalk[color](message));
};

module.exports = {
  angular: {
    validate(message) {
      const MAX_LENGTH = 100;
      const PATTERN = /^(?:fixup!\s*)?(\w*)(\(([\w\$\.\*/-]*)\))?\: (.*)$/;
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

      if (message.length >= MAX_LENGTH) {
        log(`Message is longer than 100 characters!`, 'error');

        return false;
      }

      var match = PATTERN.exec(message);

      if (!match) {
        log(`Message does not match "<type>(<scope>): <subject>" ! was: ${message}`, 'error');

        return false;
      }

      var type = match[1];
      // in case they are needed
      // var scope = match[3];
      // var subject = match[4];

      if (!TYPES.hasOwnProperty(type)) {
        log(`'${type}' is not an allowed type!`, 'error');
        log(`Valid types are: ${keys(TYPES).join(', ')}`, 'info');

        return false;
      }

      return true;
    },
    ignorePattern: /^WIP\:/
  }
};
