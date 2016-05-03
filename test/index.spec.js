import { expect } from 'chai';

import { validateMessage, validateMessageFromFile } from '../dist';
import presets from '../dist/presets';

describe('#validateMessage', function() {
  it('should return false if no message is provided', function() {
    expect(validateMessage()).to.be.false;
    expect(validateMessage('')).to.be.false;
  });

  it('should omit validation if ignore pattern is provided', function() {
    expect(validateMessage('WIP: ignore me')).to.be.true;
  });

  it('should throw an error if no valid preset is provided', function() {
    const f = function() {
      validateMessage('chore(package): foo', {
        preset: 'notapreset'
      });
    };

    expect(f).to.throw(Error);
  });
});

describe('#validateMessageFromFile', function() {
  const validFixture = {};
  const wrongFixture = {};

  for (let preset in presets) {
    validFixture[preset] = `${__dirname}/fixtures/${preset}/valid.txt`;
    wrongFixture[preset] = `${__dirname}/fixtures/${preset}/wrong.txt`;
  }

  for (let preset in validFixture) {
    it(`should accept a valid message for ${preset} preset`, function() {
      expect(validateMessageFromFile(validFixture[preset], { preset })).to.be.true;
    });
  }

  for (let preset in wrongFixture) {
    it(`should reject a wrong message for ${preset} preset`, function() {
      expect(validateMessageFromFile(wrongFixture[preset], { preset })).to.be.false;
    });
  }
});
