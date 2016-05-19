/// <reference path="typings/index.d.ts" />
/// <reference path="custom-typings/main.d.ts" />

import * as gulp from 'gulp';
import * as bump from 'gulp-bump';
import * as git from 'gulp-git';
import * as filter from 'gulp-filter';
import * as tag from 'gulp-tag-version';
import * as changelog from 'gulp-conventional-changelog';

import * as runSequence from 'run-sequence';

interface Config {
  importance: string;
}

var config: Config = {
  importance: 'patch'
};

function getImportance(): string {
  return config.importance;
}

function release(): void {
  runSequence(
    'bump',
    'changelog',
    'commit-release'
  );
}

gulp.task('changelog', function() {
  return gulp.src('./CHANGELOG.md', {
      buffer: false
    })
    .pipe(changelog({
      preset: 'angular'
    }))
    .pipe(gulp.dest('./'));
});

gulp.task('bump', function() {
  return gulp.src([
      './package.json'
    ])
    .pipe(bump({
      type: getImportance()
    }))
    .pipe(gulp.dest('./'));
});

gulp.task('commit-release', function() {
  return gulp.src([
      './package.json',
      './CHANGELOG.md'
    ])
    .pipe(git.add({
      args: '-A'
    }))
    .pipe(git.commit(`chore(release): New ${getImportance()} release`, {
      args: '--no-verify'
    }))
    .pipe(filter('package.json'))
    .pipe(tag());
});

gulp.task('release:patch', function() {
  return release();
});

gulp.task('release:minor', function() {
  config.importance = 'minor';

  return release();
});

gulp.task('release:major', function() {
  config.importance = 'major';

  return release();
});
