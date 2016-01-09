import {
  expect
}
from 'chai';

import {
  validateMessage, validateMessageFromBuffer
}
from '../src';

describe('#validateMessage', function() {
  it('should return false if no message is provided', function() {
    expect(validateMessage()).to.be.false;
  });

  it('should ignore validation if the message contains "WIP"', function() {
    expect(validateMessage('WIP: some message')).to.be.true;
  });

  it('should return false if the message length is greater than 100', function() {
    var str = new Array(100 + 1).join('a');

    expect(validateMessage(`test(foo): ${str}`)).to.be.false;
  });

  it('should return false if it is not in the correct format', function() {
    expect(validateMessage('bar[foo]: aaaaa')).to.be.false;

    expect(validateMessage('barfoo]: aaaaa')).to.be.false;

    expect(validateMessage('bar{foo}: aaaaa')).to.be.false;
  });

  it('should return false if the type provided is not valid', function() {
    expect(validateMessage('foo(bar): bbbbbb')).to.be.false;
  });

  it('should validate a message if a valid type is provided', function() {
    expect(validateMessage('chore(package): update package')).to.be.true;
  });

  it('should validate a message under 100 characters', function() {
    var str = new Array(80).join('a');

    expect(validateMessage(`chore(package): ${str}`)).to.be.true;
  });

  it('should throw an error if no preset is provided', function() {
    var f = function() {
      validateMessage('chore(package): foo', {
        preset: 'notapreset'
      });
    };

    expect(f).to.throw(Error);
  });
});

describe('#validateMessageFromBuffer', function() {
  it('should accept a valid message', function() {
    expect(validateMessageFromBuffer(`${__dirname}/valid.txt`)).to.be.true;
  });

  it('should reject an invalid message', function() {
    expect(validateMessageFromBuffer(`${__dirname}/invalid.txt`)).to.be.false;
  });
});
