var files = require('./files').files, 
	path = require("path"), 
	spawn = require('child_process').spawn;

module.exports = function(grunt) {
	grunt.initConfig({
				pkg : grunt.file.readJSON('package.json'),
				bower : {
					install : {
						options : {
							targetDir : "bower_modules",
							cleanup : true,
							layout : function(type, component) {
								var renamedType = type;
								if (type == 'js')
									renamedType = 'javascripts';
								else if (type == 'css')
									renamedType = 'stylesheets';

								return path.join(component, renamedType);
							}
						}
					}
				},
				jison : {
					l : {
						options: { moduleType: 'js' },
						files: {'src/lparser.js' : 'src/lgrammar.jison'}
					}
				},
				build : {
					l2js : {
						dest : "dist/l2js-v<%= pkg.version %>.js",
						src : wrap(files.src, "build")

					}
				},
				tests : {
					unit : 'karma.config.js',
				},
				uglify : {
					l2js : {
						files : {
							"dist/l2js-v<%= pkg.version %>.min.js" : [ "dist/l2js-v<%= pkg.version %>.js" ]
						},
						options : {
							preserveComments : false,
							sourceMap : "dist/l2js-v<%= pkg.version %>.min.map",
							sourceMappingURL : "dist/l2js-v<%= pkg.version %>.min.map",
							report : "min",
							beautify : {
								ascii_only : true
							},
							banner : "/*! L2JS v<%= pkg.version %> | "
									+ "Copyright 2013, 2013 Tomáš Konrády (tomas.konrady@uhk.cz). | "
									+ "MIT licence */",
							compress : {
								hoist_funs : false,
								loops : false,
								unused : false
							}
						}
					}
				},

				clean : {
					build : [ 'dist' ]
				},

				compress : {
					build : {
						options : {
							archive : 'dist/l2js-v<%= pkg.version %>.zip',
							mode : 'zip'
						},
						src : [ '**' ],
						cwd : 'dist',
						expand : true,
						dot : true,
						dest : 'l2js-v<%= pkg.version %>/'
					}
				},
			});

	function build(config, success) {
		var files = grunt.file.expand(config.src);

		// concat
		var src = files.map(function(filepath) {
			return processFile(grunt.file.read(filepath));
		}).join(grunt.util.normalizelf('\n'));

		// process
		var processed = processSource(src, grunt.config("pkg").version);

		// write
		grunt.file.write(config.dest, processed);
		grunt.log.ok('File ' + config.dest + ' created.');

		success();
	}

	/**
	 * Process contacted source. Fills metadata in the banner and removes
	 * multiple used 'use strict' expression.
	 * 
	 * @param src
	 *            Contacted source
	 * @param version
	 *            Version of source
	 */
	function processSource(src, version) {
		// Fills in metadata to header of code
		var processed = src.replace(/@VERSION/, version).replace(/@DATE/,
				new Date().toISOString());

		processed = singleStrict(processed, '\n\n');
		return processed;
	}

	/**
	 * Removes closure declarations
	 * 
	 * @param src
	 *            Source of single file
	 */
	function processFile(src) {
		var closureRegexStart = /window\.l2js.*\(l2js\)\s*\{/;
		var closureRegexEnd = /\}\(window.l2js\);\s*$/;

		var processed = src.replace(closureRegexStart, "\n")
				.replace(closureRegexEnd, "\n");
		return processed;
	}

	/**
	 * Adds prefix a suffix to the array files.
	 * 
	 * @param name
	 *            Name of prefix/suffix combination
	 */
	function wrap(files, name) {
		files.unshift('src/' + name + '.prefix.js');
		files.push('src/' + name + '.suffix.js');
		return files;
	}

	function singleStrict(src, insert) {
		return src
		// remove all file-specific strict mode flags
		.replace(/\s*("|')use strict("|');\s*/g, insert)
		// add single strict mode flag
		.replace(/(\(function\([^)]*\)\s*\{)/, "$1'use strict';");
	}

	function startKarma(config, singleRun, done) {
		var browsers = grunt.option('browsers');
		var reporters = grunt.option('reporters');
		var noColor = grunt.option('no-colors');
		var port = grunt.option('port');
		var p = spawn('node', [ 'node_modules/karma/bin/karma', 'start',
				config, singleRun ? '--single-run=true' : '',
				reporters ? '--reporters=' + reporters : '',
				browsers ? '--browsers=' + browsers : '',
				noColor ? '--no-colors' : '', port ? '--port=' + port : '' ]);

		p.stdout.pipe(process.stdout);
		p.stderr.pipe(process.stderr);

		p.on('exit', function(code) {
			if (code !== 0) {
				grunt.fail.warn("Karma test(s) failed. Exit code: " + code);
			}
			done();
		});
	}
	
	/**
	 * Generate application module from JISON generated parser 
	 */
	function processGrammarFile(filepath, success) {
		var src = grunt.file.read(filepath);
		var names = filepath.match(/[\\\/]([^\.]+)\.js$/, filepath);
		

		src = src.replace(/var\s*parser\s*=\s*\(function\(\)\{/g, 'window.l2js && function(l2js) {'+ "\n" +'l2js.' + names[1] + ' = (function(){');
		src = src.replace(/\}\)\(\);$/g, '})();'+ "\n" +'}(window.l2js);');
		
		grunt.file.write(filepath, src);
	}

	require("load-grunt-tasks")(grunt);

	grunt.registerMultiTask('tests', '**Use `grunt test` instead**',
			function() {
				startKarma(this.data, true, this.async());
			});

	grunt.registerMultiTask("build", function() {
		build(this.data, this.async);
	});
	
	grunt.registerTask('wrapparsers', 'wrap jison parsers to app format',
			function() {
				grunt.util.async.forEach(files.parsers, processGrammarFile, this.async());
			});


	grunt.registerTask('buildall', 'buildall the JS files in parallel',
			function() {
				var builds = grunt.config('build');
				builds = Object.keys(builds).map(function(key) {
					return builds[key];
				});
				grunt.util.async.forEach(builds, build, this.async());
			});

	grunt.registerTask('uglifyall', 'uglify all the tasks it parallel',
			function() {
				grunt.log.writeln("Starting uglify all tasks...");
				var profiles = grunt.config('uglify'), tasks = Object
						.keys(profiles);

				grunt.util.async.forEach(tasks, function(task, success) {
					grunt.task.run("uglify:" + task);
					success();
				}, this.async());

			});
	grunt.registerTask('package', [ "bower", "clean", "grammar", "buildall", "test",
			"uglifyall", "compress" ]);
	grunt.registerTask('dev', [ "clean", "buildall" ]);
	grunt.registerTask('grammar', [ 'jison', 'wrapparsers' ]);
	grunt.registerTask('test', [ 'tests:unit' ]);
	grunt.registerTask('default', [ 'package' ]);
};