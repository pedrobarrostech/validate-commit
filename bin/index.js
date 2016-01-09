#!/usr/bin/env node

var program = require('commander');

var pkg = require('../package.json');

var validateMessage = require('../dist').validateMessage;
var validateMessageFromBuffer = require('../dist').validateMessageFromBuffer;

program
  .version(pkg.version)
  .description(pkg.description)
  .command('validate-commit-msg <message>', 'validate a message')
  .action(function(message) {
    // hacky start if this is being used as a git hook
    // it will read in the message from a file instead of the command line
    if (process.argv.join('').indexOf('.git') > -1) {
      if (!validateMessageFromBuffer(message)) {
        process.exit(1);
      }
      process.exit(0);
    } else {
      if (!validateMessage(message)) {
        process.exit(1);
      }
      process.exit(0);
    }
  });

program.parse(process.argv);
