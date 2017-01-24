// Karma configuration
// Generated on Tue Jan 24 2017 16:33:13 GMT+0800 (CST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['polymer', 'jasmine'],


    // list of files / patterns to load in the browser
    files: [
        { pattern: 'bower_components/**', included: false, served: true, watched: true },
        'stocktickerraw.js',
        './test/stock-ticker.test.js',
        './test/stock-ticker-raw.test.js'
    ],

    polymer: {
      // platform: 'bower_components/platform/platform.js',
      src: [
        './bower_components/polymer/polymer.html',
        'stock-ticker-es6.html',
        'stock-ticker-es6.js'
      ]
    },

    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    // update: add karma-spec-reporter, so we can use 'spec' here
    reporters: ['spec'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['ChromeCanary'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
