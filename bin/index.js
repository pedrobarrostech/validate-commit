#!/usr/bin/env node

var yargs = require('yargs');
var isFile = require('is-file');

var validate = require('../dist');

var argv = yargs
  .usage('validate-commit-msg <message>')
  .option('preset', {
    alias: 'p',
    type: 'string',
    'default': 'angular',
    description: 'specify a preset',
    choices: [
      'angular',
      'atom',
      'eslint',
      'ember',
      'jquery',
      'jshint'
    ]
  })
  .option('silent', {
    alias: 's',
    type: 'boolean',
    'default': false,
    description: 'mute log messages'
  })
  .version()
  .help()
  .argv;

var valid = false;

var message = argv._[0];
var options = {
  preset: argv.preset
};

if (argv.silent) {
  process.env.SILENT = true;
}

if (isFile(message)) {
  valid = validate.validateMessageFromFile(message, options);
} else {
  valid = validate.validateMessage(message, options);
}

if (valid === false) {
  process.exit(1);
}
process.exit(0);
