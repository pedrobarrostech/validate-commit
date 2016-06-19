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

function log(message: string, severity: Severity = 'info'): void {
  const color: string = LOG_LEVELS[severity].color || 'cyan';

  if (process.env.SILENT !== 'true') {
    console.log((<any>chalk)[color](message));
  }
};

const presets: Presets = {
  angular: {
    validate(message: string): boolean {
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
      const TYPES: any = {
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

      // angular only cares about the first line
      message = message.split('\n').shift();

      if (message.length >= MAX_LENGTH) {
        log(`Message is longer than ${MAX_LENGTH} characters!`, 'error');

        return false;
      }

      const match: RegExpExecArray = PATTERN.exec(message);

      if (!match) {
        log(`Message does not match "<type>(<scope>): <subject>"! was: ${message}`, 'error');

        return false;
      }

      const type: string = match[1];
      // in case they are needed
      // const scope: string = match[3];
      // const subject: string = match[4];

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
    validate(message: string): boolean {
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

      // atom only cares about the first line
      message = message.split('\n').shift();

      if (message.length > MAX_LENGTH) {
        log(`Message is longer than ${MAX_LENGTH} characters!`, 'error');

        return false;
      }

      const match: RegExpExecArray = PATTERN.exec(message);

      if (!match) {
        log(`Message does not match "<emoji> <subject>"! was: ${message}`, 'error');
        log(`Valid emojis are: ${EMOJIS.join(', ')}`, 'info');

        return false;
      }

      return true;
    }
  },
  eslint: {
    validate(message: string): boolean {
      // Fixup pattern (optional)
      const FIXUP: string = '(?:fixup!\\s*)?';
      // A string starting with an uppercase character
      const TAG: string = '([A-Z][a-z]+)';
      // A github issue reference - e.g., #1234, GH-1, gh-1, user/repo#1234
      const GH: string = '(?:(?:[A-Za-z0-9_-]+)\\/(?:[A-Za-z0-9_.-]+))?(?:(?:#|[Gg][Hh]-)\\d+)';
      // Any string starting with an uppercase character or a digit and not referencing a github issue
      const MESSAGE: string = `((?=[A-Z0-9])(?:(?!${GH}).)*)`;
      // Zero or more comma-separated github references preceded by the word "fixes" or "refs", enclosed by parentheses
      const ISSUE: string = `(\\s\\((?:(?:(?:fixes|refs)\\s${GH})(?:,\\s(?!\\))|\\)))+)?`;
      const PATTERN: RegExp = new RegExp(`^${FIXUP}${TAG}:\\s${MESSAGE}${ISSUE}$`);

      // Pattern is:
      // /^
      //   (?:fixup!\\s*)?
      //   ([A-Z][a-z]+):\\s
      //   ((?=[A-Z])(?:(?!(?:(?:[A-Za-z0-9_-]+)\\/(?:[A-Za-z0-9_.-]+))?(?:(?:#|[Gg][Hh]-)\\d+)).)*)
      //   (\\s\\((?:(?:(?:fixes|refs)\\s(?:(?:[A-Za-z0-9_-]+)\\/(?:[A-Za-z0-9_.-]+))?(?:(?:#|[Gg][Hh]-)\\d+))(?:,\\s(?!\\))|\\)))+)?
      // $/

      // only care about the first line
      message = message.split('\n').shift();

      const match: RegExpExecArray = PATTERN.exec(message);

      if (!match) {
        log('Message does not match "Tag: Message (fixes #1234)".', 'error');
        log(`Given: "${message}".`, 'info');

        return false;
      }

      const matches: Array<string> = match.filter(str => str ? true : false).map(str => str.trim());
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
  },
  ember: {
    validate(message: string): boolean {
      const TAGS: Array<string> = [
        'DOC',
        'FEATURE',
        'BUGFIX',
        'SECURITY'
      ];
      const TAG: string = `(${TAGS.join('|')})`;
      const MESSAGE: string = '(.*)';
      const GIT_MESSAGE: string = '(.*)';
      const VALID_CHANNELS: Array<string> = [
        'canary',
        'beta',
        'release'
      ];

      const PATTERN: RegExp = new RegExp(`^\\[${TAG} ${MESSAGE}\\] ${GIT_MESSAGE}`);

      // ember only cares about the first line
      message = message.trim().split('\n').shift();

      // match[1] = <tag>
      // match[2] = <message>
      // match[3] = <git-message>
      const match: RegExpExecArray = PATTERN.exec(message);

      if (!match) {
        log('Message does not match "[<tag> <message>] <git-message>"', 'error');
        log(`Given: "${message}".`, 'info');

        return false;
      }

      const tag: string = match[1];
      const msg: string = match[2];

      if (tag === 'DOC' && VALID_CHANNELS.indexOf(msg) === -1) {
        log('Not a valid channel for DOC', 'error');
        log(`Valid channels are ${VALID_CHANNELS.join(', ')}`);

        return false;
      }

      return true;
    }
  },
  jquery: {
    validate(message: string): boolean {
      const SUBJECT_MAX_LENGTH: number = 72;
      const LONG_DESCRIPTION_MAX_LENGTH: number = 80;
      const SUBJECT_PATTERN: RegExp = /^(\w*): ([\w\s\S]*[^.])$/;

      const messageParts: string[] = message.trim().split('\n').map(line => line.trim());

      const subject: string = messageParts[0];
      const match: RegExpExecArray = SUBJECT_PATTERN.exec(subject);

      if (subject.length > SUBJECT_MAX_LENGTH) {
        log(`Subject is longer than ${SUBJECT_MAX_LENGTH} characters.`, 'error');

        return false;
      }

      if (!match) {
        log('Subject does not match "Component: Short Description".', 'error');
        log(`Given: "${subject}".`, 'info');

        return false;
      }

      const isMessageLengthValid: boolean = messageParts.slice(1).every(function(part: string): boolean {
        return part.length < LONG_DESCRIPTION_MAX_LENGTH;
      });

      if (!isMessageLengthValid) {
        log(`Line lengths (except the subject one) should be wrapped at ${LONG_DESCRIPTION_MAX_LENGTH} columns.`, 'error');

        return false;
      }

      return true;
    }
  },
  jshint: {
    validate(message: string): boolean {
      const HEADER_LENGTH: number = 60;
      const LINES_LENGTH: number = 100;

      // A github issue reference - e.g., #1234, GH-1, gh-1, user/repo#1234
      const GH: string = '(?:(?:[A-Za-z0-9_-]+)\\/(?:[A-Za-z0-9_.-]+))?(?:(?:#|[Gg][Hh]-)\\d+)';
      // Any string starting with an uppercase character or a digit and not referencing a github issue
      const SHORTDESCR: string = `((?=[A-Z0-9])(?:(?!${GH}).)*)`;
      // [[TYPE]] part
      const TITLE: string = '\\[{2}([A-Z]+)\\]{2}';
      // Fixup pattern (optional)
      const FIXUP: string = '(?:fixup!\\s*)?';
      const HEADER_PATTERN: RegExp = new RegExp(`^${FIXUP}${TITLE}\\s${SHORTDESCR}$`);

      const lines: string[] = message.trim().split('\n').map(line => line.trim());
      const header: string = lines.shift();

      if (header.length > HEADER_LENGTH) {
        log(`Header is longer than ${HEADER_LENGTH} characters.`, 'error');

        return false;
      }

      const match: RegExpExecArray = HEADER_PATTERN.exec(header);

      if (!match) {
        log('Header does not match "[[TYPE]] Short description".', 'error');
        log(`Given: "${header}".`, 'info');

        return false;
      }

      // Is input title ok?
      const TITLES: string[] = ['FIX', 'FEAT', 'DOCS', 'TEST', 'CHORE'];

      if (TITLES.indexOf(match[1]) === -1) {
        log(`The word "${match[1]}" is not an allowed title.`, 'error');
        log(`Valid titles are: ${TITLES.join(', ')}.`, 'info');

        return false;
      }

      // Early exit for one line commit messages
      if (lines.length === 0) {
        return true;
      }

      const secondLine: string = lines.shift();

      // Is second line a blank one?
      if (secondLine.length > 0) {
        log('Second line of commit message must be a blank line.', 'error');

        return false;
      }

      if (!lines.every(line => line.length <= LINES_LENGTH)) {
        log(`Line lengths (except first) should be wrapped at ${LINES_LENGTH} columns.`, 'error');

        return false;
      }

      return true;
    },
    ignorePattern: /^\[{2}WIP\]{2}/
  }
};

export default presets;
