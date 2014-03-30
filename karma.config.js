var files = require('./files').files;
var sharedConfig = require('./karma-shared.config');

module.exports = function(config) {
  sharedConfig(config, {testName: 'L2JS: unit', logFile: 'karma-unit.log'});

  config.set({
    files: files.test,

    junitReporter: {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }
  });
};