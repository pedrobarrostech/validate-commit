import { expect } from 'chai';
import 'mocha-sinon';

import { validateMessage, validateMessageFromFile } from '../dist';
import presets from '../dist/presets';

describe('#validateMessage', function() {
  it('should return false if no message is provided', function() {
    expect(validateMessage()).to.be.false;
    expect(validateMessage('')).to.be.false;
  });

  it('should throw an error if no valid preset is provided', function() {
    const f = function() {
      validateMessage('chore(package): foo', {
        preset: 'notapreset'
      });
    };

    expect(f).to.throw(Error);
  });

  describe('#ignorePattern', function() {
    beforeEach(function() {
      this.sinon.stub(console, 'warn');
    });

    afterEach(function() {
      this.sinon.restore();
    });

    it('should omit validation if ignore pattern is provided', function() {
      expect(validateMessage('WIP: ignore me')).to.be.true;
    });

    it('should warn that validation has been ignored when CI env variable is missing and ignore pattern is used', function() {
      delete process.env.CI;
      validateMessage('WIP: work in progress');
      expect(console.warn.calledOnce).to.be.true;
      expect(console.warn.calledWith('Commit message validation ignored.')).to.be.true;
      process.env.CI = true;
    });
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

  it('should use the default preset', function() {
    const defaultPreset = 'angular';
    expect(validateMessageFromFile(`${__dirname}/fixtures/${defaultPreset}/wrong.txt`)).to.be.false;
  });
});

describe('#logging', function() {
  beforeEach(function() {
    // Some mocha reporters use console.log as well, so the tests that stub it may not yield any output
    // Workaround
    var log = console.log;
    this.sinon.stub(console, 'log', function() {
      return log.apply(log, arguments);
    });
  });

  afterEach(function () {
    this.sinon.restore();
  });

  it('should not work when CI env variable is true (the default of the testing environment)', function() {
    validateMessage('invalid message');
    expect(console.log.calledOnce).to.be.false;
  });

  it('should work when CI env variable is missing', function() {
    delete process.env.CI;
    validateMessage('invalid message');
    expect(console.log.calledOnce).to.be.true;
    process.env.CI = true;
  });
});
