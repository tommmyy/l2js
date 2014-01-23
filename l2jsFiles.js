l2jsFiles = {
	"src" : [ "src/l2js.js", 
	          "src/core.js", 
	          "src/core/deferred.js",
	          "src/compiler.js",
	          "src/lparser.js",
	          "src/facade.js"
	          ],
	"parsers": ["src/lparser.js"],
	"test" : ["dist/l2js-v*.js", "test/*.js", "test/core/*.js"]
}

if (exports) {
	exports.files = l2jsFiles;
}