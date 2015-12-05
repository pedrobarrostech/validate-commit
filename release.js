#! /usr/bin/env node --harmony

var fs = require('fs');
var changelog = require('conventional-changelog');
var program = require('commander');
var mversion = require('mversion');
var chalk = require('chalk');
var git = require('simple-git')();

program
    .version('0.0.1')
    .command('release <importance>', 'Make a release')
    .option('-v, --verbose', 'Set verbosity', true)
    .action(function(importance) {
        var tagMessage = `chore(release): new ${importance} version`;

        mversion.update(importance, function(err, data) {
            if (err) {
                throw err;
            }

            if (program.verbose) {
                console.log(chalk.magenta(`Package versioned bumped to v${data.newVersion}`));
            }

            changelog({
                preset: 'angular',
                infile: './CHANGELOG.md',
                overwrite: true
            }).pipe(fs.createWriteStream('./CHANGELOG.md'));

            if (program.verbose) {
                console.log(chalk.magenta('CHANGELOG written'));
            }

            git.commit(tagMessage, [
                './CHANGELOG.md',
                './package.json'
            ], function(err) {
                if (err) {
                    throw err;
                }

                git.addAnnotatedTag(`v${data.newVersion}`, tagMessage, function(err) {
                    if (err) {
                        throw err;
                    }

                    if (program.verbose) {
                        console.log(chalk.magenta('Tagged new version'));
                    }
                });
            });
        });
    });

program.parse(process.argv);
