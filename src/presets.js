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
      /**
       * Git COMMIT-MSG hook for validating commit message
       * See https://docs.google.com/document/d/1rk04jEuGfk9kYzfqCuOlPTSJw3hEDZJTBN5E5f1SALo/edit
       *
       * Taken from https://github.com/angular/angular.js/blob/master/validate-commit-msg.js
       * and cleaned up a bit
       *
       * Thanks to the Angular team!
       */
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
        log(`Message is longer than ${MAX_LENGTH} characters!`, 'error');

        return false;
      }

      var match = PATTERN.exec(message);

      if (!match) {
        log(`Message does not match "<type>(<scope>): <subject>"! was: ${message}`, 'error');

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
  },
  atom: {
    validate(message) {
      const MAX_LENGTH = 72;
      const EMOJIS = [
        ':art:',
        ':racehorse:',
        ':non-potable_water:',
        ':memo:',
        ':penguin:',
        ':apple:',
        ':checkered_flag:',
        ':bug:',
        ':fire:',
        ':green_heart:',
        ':white_check_mark:',
        ':lock:',
        ':arrow_up:',
        ':arrow_down:',
        ':shirt:'
      ];
      const PATTERN = new RegExp(`^(${EMOJIS.join('|')})(?:\ )(?:.*)$`);

      if (message.length > MAX_LENGTH) {
        log(`Message is longer than ${MAX_LENGTH} characters!`, 'error');

        return false;
      }

      var match = PATTERN.exec(message);

      if (!match) {
        log(`Message does not match "<emoji> <subject>"! was: ${message}`, 'error');
        log(`Valid emojis are: ${EMOJIS.join(', ')}`, 'info');

        return false;
      }

      return true;
    }
  }
};
