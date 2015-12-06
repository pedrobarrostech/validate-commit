const PRESETS = {
    angular: {
        MAX_LENGTH: 100,
        PATTERN: /^(?:fixup!\s*)?(\w*)(\(([\w\$\.\*/-]*)\))?\: (.*)$/,
        IGNORED: /^WIP\:/,
        TYPES: {
            feat: true,
            fix: true,
            docs: true,
            style: true,
            refactor: true,
            perf: true,
            test: true,
            chore: true,
            revert: true
        }
    }
};

module.exports = PRESETS;
