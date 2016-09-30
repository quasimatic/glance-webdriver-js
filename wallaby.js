module.exports = function (wallaby) {
    return {
        files: [
            {pattern: 'src/utils/client.js'},
            {pattern: 'test/helpers/*.js', instrument: false},
            'src/**/*.js',
            'test/**/*.js',
            '!test/**/*-specs.js',
            'test/**/*.html'
        ],

        tests: [
            'test/**/*-specs.js'
        ],

        compilers: {
            '**/*.js': wallaby.compilers.babel({
                presets: ['es2015', 'stage-0'],
                babel: require('babel-core')
            })
        },

        env: {
            type: 'node'
        },

        testFramework: "mocha",

        bootstrap: function () {
            require('./test/test-helper');
        }
    };
};