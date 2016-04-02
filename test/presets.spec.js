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
});
