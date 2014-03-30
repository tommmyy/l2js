l2jsFiles = {
	"src" : [ "src/l2js.js", 
	          "src/core.js", 
	          "src/core/deferred.js",
	          "src/utils.js",
	          "src/compiler.js",
	          "src/compiler/env.js",
	          "src/compiler/env/alphabet.js",
	          "src/compiler/env/sublsystem.js",
	          "src/compiler/env/lsystem.js",
	          "src/compiler/env/lscript.js",
	          "src/compiler/env/sublscript.js",
	          "src/compiler/lnodes.js",
	          "src/compiler/lparser.js",
	          "src/compiler/astcompiler.js",
	          "src/compiler/compiler.js",
	          "src/facade.js"
	          ],
	"parsers": ["src/compiler/lparser.js"],
	"test" : ["dist/l2js-v*.js", 
	          "test/*.js", 
	          "test/core/*.js", 
	          "test/compiler/*.js", 
	          "test/compiler/env/*.js"]
}

if (exports) {
	exports.files = l2jsFiles;
}