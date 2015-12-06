#!/usr/bin/env node

var fs = require('fs');
var program = require('commander');

var pkg = require('../package.json');

var validateMessage = require('../dist');

var firstLineFromBuffer = function(buffer) {
    return buffer.toString().split('\n').shift();
};

program
    .version(pkg.version)
    .description(pkg.description)
    .command('validate-commit-msg <message>', 'validate a message')
    .action(function(message) {
        // hacky start if this is being used as a git hook
        // it will read in the message from a file instead of the command line
        if (process.argv.join('').indexOf('.git') > -1) {
            var commitMsgFile = message;
            var incorrectLogFile = commitMsgFile.replace('COMMIT_EDITMSG', 'logs/incorrect-commit-msgs');

            fs.readFile(commitMsgFile, function(err, buffer) {
                var msg = firstLineFromBuffer(buffer);

                if (!validateMessage(msg)) {
                    fs.appendFile(incorrectLogFile, `${buffer}\n`, function() {
                        process.exit(1);
                    });
                } else {
                    process.exit(0);
                }
            });
        } else {
            if (!validateMessage(message)) {
                process.exit(1);
            }
            process.exit(0);
        }
    });

program.parse(process.argv);
