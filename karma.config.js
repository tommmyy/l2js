var l2jsFiles = require('./l2jsFiles').files;
var sharedConfig = require('./karma-shared.config');

module.exports = function(config) {
  sharedConfig(config, {testName: 'L2JS: unit', logFile: 'karma-unit.log'});

  config.set({
    files: l2jsFiles.test,

    junitReporter: {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }
  });
};