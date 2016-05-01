import * as chalk from 'chalk';

import { LogLevels, Presets } from './interfaces';

const LOG_LEVELS: LogLevels = {
  error: {
    color: 'red'
  },
  warn: {
    color: 'yellow'
  },
  info: {
    color: 'cyan'
  },
  debug: {
    color: 'white'
  }
};

type Severity = 'error' | 'warn' | 'info' | 'debug';

const log = function(message: string, severity: Severity = 'info'): void {
  const color: string = LOG_LEVELS[severity].color || 'cyan';

  console.log((<any>chalk)[color](message));
};

const presets: Presets = {
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
      const MAX_LENGTH: number = 100;
      const PATTERN: RegExp = /^(?:fixup!\s*)?(\w*)(\(([\w\$\.\*/-]*)\))?\: (.*)$/;
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

      const match = PATTERN.exec(message);

      if (!match) {
        log(`Message does not match "<type>(<scope>): <subject>"! was: ${message}`, 'error');

        return false;
      }

      const type = match[1];
      // in case they are needed
      // const scope = match[3];
      // const subject = match[4];

      if (!TYPES.hasOwnProperty(type)) {
        log(`'${type}' is not an allowed type!`, 'error');
        log(`Valid types are: ${Object.keys(TYPES).join(', ')}`, 'info');

        return false;
      }

      return true;
    },
    ignorePattern: /^WIP\:/
  },
  atom: {
    validate(message) {
      const MAX_LENGTH: number = 72;
      const EMOJIS: Array<string> = [
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
      const PATTERN: RegExp = new RegExp(`^(${EMOJIS.join('|')})(?:\ )(?:.*)$`);

      if (message.length > MAX_LENGTH) {
        log(`Message is longer than ${MAX_LENGTH} characters!`, 'error');

        return false;
      }

      const match = PATTERN.exec(message);

      if (!match) {
        log(`Message does not match "<emoji> <subject>"! was: ${message}`, 'error');
        log(`Valid emojis are: ${EMOJIS.join(', ')}`, 'info');

        return false;
      }

      return true;
    }
  },
  eslint: {
    validate(message) {
      // Fixup pattern (optional)
      const FIXUP = '(?:fixup!\\s*)?';
      // A string starting with an uppercase character
      const TAG = '([A-Z][a-z]+)';
      // A github issue reference - e.g., #1234, GH-1, gh-1, user/repo#1234
      const GH = '(?:(?:[A-Za-z0-9_-]+)\\/(?:[A-Za-z0-9_.-]+))?(?:(?:#|[Gg][Hh]-)\\d+)';
      // Any string starting with an uppercase character or a digit and not referencing a github issue
      const MESSAGE = `((?=[A-Z0-9])(?:(?!${GH}).)*)`;
      // Zero or more comma-separated github references preceded by the word "fixes" or "refs", enclosed by parentheses
      const ISSUE = `(\\s\\((?:(?:(?:fixes|refs)\\s${GH})(?:,\\s(?!\\))|\\)))+)?`;
      const PATTERN: RegExp = new RegExp(`^${FIXUP}${TAG}:\\s${MESSAGE}${ISSUE}$`);

      // Pattern is:
      // /^
      //   (?:fixup!\\s*)?
      //   ([A-Z][a-z]+):\\s
      //   ((?=[A-Z])(?:(?!(?:(?:[A-Za-z0-9_-]+)\\/(?:[A-Za-z0-9_.-]+))?(?:(?:#|[Gg][Hh]-)\\d+)).)*)
      //   (\\s\\((?:(?:(?:fixes|refs)\\s(?:(?:[A-Za-z0-9_-]+)\\/(?:[A-Za-z0-9_.-]+))?(?:(?:#|[Gg][Hh]-)\\d+))(?:,\\s(?!\\))|\\)))+)?
      // $/

      const match = PATTERN.exec(message);
      if (!match) {
        log('Message does not match "Tag: Message (fixes #1234)".', 'error')
        log(`Given: "${message}".`, 'info');

        return false;
      }
      const matches: Array<string> = match.filter(m => m ? true : false).map((s) => s.trim())
      // Is input tag ok?
      const TAGS: Array<string> = ['Fix', 'Update', 'Breaking', 'Docs', 'Build', 'New', 'Upgrade'];
      if (TAGS.indexOf(matches[1]) === -1) {
        log(`The word "${matches[1]}" is not an allowed tag.`, 'error');
        log(`Valid types are: ${TAGS.join(', ')}.`, 'info');

        return false;
      }

      return true;
    },
    ignorePattern: /^WIP\:/
  }
};

export default presets;
