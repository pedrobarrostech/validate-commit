import {
    expect
}
from 'chai';

import validateCommit from '../src'


describe('#validateCommit', function() {
    it('should return false if no message is provided', function() {
        expect(validateCommit()).to.be.false;
    });

    it('should ignore validation if the message contains "WIP"', function() {
        expect(validateCommit('WIP: some message')).to.be.true;
    });

    it('should return false if the message length is greater than 100', function() {
        var str = new Array(100 + 1).join('a');
        expect(validateCommit(`test(foo): ${str}`)).to.be.false;
    });

    it('should return false if it is not in the correct format', function() {
        expect(validateCommit('bar[foo]: aaaaa')).to.be.false;
        expect(validateCommit('barfoo]: aaaaa')).to.be.false;
        expect(validateCommit('bar{foo}: aaaaa')).to.be.false;
    });

    it('should return false if the type provided is not valid', function() {
        expect(validateCommit('foo(bar): bbbbbb')).to.be.false;
    });

    it('should validate a message if a valid type is provided', function() {
        expect(validateCommit('chore(package): update package')).to.be.true;
    });

    it('should validate a message under 100 characters', function() {
        var str = new Array(80).join('a');

        expect(validateCommit(`chore(package): ${str}`)).to.be.true;
    });
});
