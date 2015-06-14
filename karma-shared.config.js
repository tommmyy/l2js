module.exports = function(config, specificOptions) {
    config.set({
        frameworks: ['jasmine'],
        autoWatch: true,
        logLevel: config.LOG_INFO,
        logColors: true,
        browsers: ['Chrome'],
        browserDisconnectTimeout: 100000000,
        browserNoActivityTimeout: 100000000,
        singleRun: false,

        // For more browsers on Sauce Labs see:
        // https://saucelabs.com/docs/platforms/webdriver
        customLaunchers: {
            'SL_Chrome': {
                base: 'SauceLabs',
                browserName: 'chrome'
            },
            'SL_Firefox': {
                base: 'SauceLabs',
                browserName: 'firefox'
            }
        }
    });

};
