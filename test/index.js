import test from 'tape'
// import validateCommit from '../src'

// test('validateCommit', (t) => {
//     t.plan(1)
//     t.equal(true, validateCommit(), 'return true')
// });

test('timing test', function (t) {
    t.plan(1);

    t.equal(typeof Date.now, 'function');
});
