module.exports = function(config, specificOptions) {
	config.set({
		frameworks : [ 'jasmine' ],
		autoWatch : true,
		logLevel : config.LOG_INFO,
		logColors : true,
		browsers : [ 'Chrome' ],
		browserDisconnectTimeout : 10000,

		// config for Travis CI
		sauceLabs : {
			testName : specificOptions.testName || 'L2JS',
			startConnect : false,
			tunnelIdentifier : process.env.TRAVIS_JOB_NUMBER
		},

		// BrowserStack config for Travis CI
		browserStack : {
			startTunnel : false,
			project : 'L2JS',
			name : specificOptions.testName,
			build : process.env.TRAVIS_BUILD_NUMBER
		},

		// For more browsers on Sauce Labs see:
		// https://saucelabs.com/docs/platforms/webdriver
		customLaunchers : {
			'SL_Chrome' : {
				base : 'SauceLabs',
				browserName : 'chrome'
			},
			'SL_Firefox' : {
				base : 'SauceLabs',
				browserName : 'firefox'
			}
		}
	});

};