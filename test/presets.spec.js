import { expect } from 'chai';

import presets from '../dist/presets';

describe('presets', function() {
  describe('angular', function() {
    var {validate, ignorePattern} = presets['angular'];

    it('should ignore validation if the message contains "WIP"', function() {
      expect(ignorePattern.test('WIP: some message')).to.be.true;
    });

    it('should return false if the message is too long', function() {
      var str = new Array(100 + 1).join('a');

      expect(validate(`test(foo): ${str}`)).to.be.false;
    });

    it('should return false if it is not in the correct format', function() {
      expect(validate('bar[foo]: aaaaa')).to.be.false;

      expect(validate('barfoo]: aaaaa')).to.be.false;

      expect(validate('bar{foo}: aaaaa')).to.be.false;
    });

    it('should return false if the type provided is not valid', function() {
      expect(validate('foo(bar): bbbbbb')).to.be.false;
    });

    it('should validate a message if a valid type is provided', function() {
      expect(validate('chore(package): update package')).to.be.true;
    });

    it('should validate a message under 100 characters', function() {
      var str = new Array(80).join('a');

      expect(validate(`chore(package): ${str}`)).to.be.true;
    });
  });

  describe('atom', function() {
    var {validate} = presets['atom'];

    it('should return false if the message is too long', function() {
      var str = new Array(72 + 1).join('a');

      expect(validate(`:art: ${str}`)).to.be.false;
    });

    it('should reject invalid emojis', function() {
      expect(validate(':banana: fix a thing')).to.be.false;
    });

    it('should reject multiple emojis', function() {
      expect(validate(':art::racehorse: fix another thing')).to.be.false;
    });

    it('should validate a properly formatted message', function() {
      expect(validate(':art: make it pretty')).to.be.true;
    });
  });

  describe('eslint', function() {
    var {validate, ignorePattern} = presets['eslint'];

    it('should ignore validation if the message contains "WIP"', function() {
      expect(ignorePattern.test('WIP: Some message')).to.be.true;
    });

    it('should validate a correct commit message preceded by "fixup!" prefix', function() {
      expect(validate('fixup! Fix: Message (refs #1234)')).to.be.true;
      expect(validate('fixup! Fix: Message')).to.be.true;
    });

    it('should return false if it is not in the correct format', function() {
      // Lowercase message
      expect(validate('Tag: message')).to.be.false;
      // Lowercase tag
      expect(validate('tag: Message')).to.be.false;
      expect(validate('tag: message')).to.be.false;
      // Message containing a reference to a github issue
      expect(validate('Tag: Close user/repo#22')).to.be.false;
      expect(validate('Tag: Close user/my.repo#22')).to.be.false;
      expect(validate('Tag: Close my-user/my-repo#22')).to.be.false;
      expect(validate('Tag: Close my-user/my.repo#22')).to.be.false;
      expect(validate('Tag: Close my_user/my_repo#22')).to.be.false;
      expect(validate('Tag: Close my_user/my.repo#22')).to.be.false;
      expect(validate('Tag: Close #22')).to.be.false;
      expect(validate('Tag: Close gh-22')).to.be.false;
      expect(validate('Tag: Close GH-22')).to.be.false;
      // Space missing after message
      expect(validate('Tag: Ciao(refs #1987)')).to.be.false;
      expect(validate('Fix: Ciao(fixes user/repo#1987)')).to.be.false;
      // More issue references not comma separated
      expect(validate('Fix: Ciao (fixes #87) (refs #22)')).to.be.false;
      // Test after issue references
      expect(validate('Fix: Message (fixes #87) text')).to.be.false;
    });

    it('should return false if the tag provided is not valid', function() {
      expect(validate('Unknown: Message')).to.be.false;
      expect(validate('Unknown: Message (refs #22)')).to.be.false;
    });

    it('should validate a correct commit message', function() {
      expect(validate('Fix: Message')).to.be.true;
      expect(validate('New: Preset for eslint')).to.be.true;
      expect(validate('Update: 1st change')).to.be.true;
      expect(validate('Breaking: New APIs (refs #1)')).to.be.true;
      expect(validate('Docs: Readme (refs #10)')).to.be.true;
      expect(validate('Build: Gulp (refs gh-22)')).to.be.true;
      expect(validate('Update: Ciao (refs GH-22)')).to.be.true;
      expect(validate('Update: Ciao (refs user/repo#22)')).to.be.true;
      expect(validate('Update: Ciao (refs user/one.repo#22)')).to.be.true;
      expect(validate('Update: Ciao (refs my-user/one-repo#22)')).to.be.true;
      expect(validate('Update: Ciao (refs my-user/one_repo#22)')).to.be.true;
      expect(validate('Update: Ciao (refs my_user/one-repo#22)')).to.be.true;
      expect(validate('Update: Ciao (refs my_user/one_repo#22)')).to.be.true;
      expect(validate('Update: Ciao (refs user/one-repo#22)')).to.be.true;
      expect(validate('Update: Ciao (refs user/one_repo#22)')).to.be.true;
      expect(validate('Fix: Ciao (fixes #22)')).to.be.true;
      expect(validate('Upgrade: Ciao (refs #87, fixes #22)')).to.be.true;
    });
  })
});
