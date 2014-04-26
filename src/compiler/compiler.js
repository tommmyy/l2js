'use strict';

/**
 * Compiler compiles L2 code to JavaScript sequence of symbols generated as the
 * result derivation.
 * @class
 */

window.l2js && window.l2js.compiler.Lparser && window.l2js.compiler.lnodes && window.l2js.compiler.L2Compiler && window.l2js.compiler.ASTCompiler && function(l2js) {

	function ParseError(msg, line) {
		this.msg = msg;
		this.line = line;
	}


	ParseError.prototype.toString = function() {
		return this.msg;
	};

	l2js.compiler.Compiler = (function() {

		function Compiler() {
			this.ASTCompiler = l2js.compiler.ASTCompiler;
			this.L2Compiler = l2js.compiler.L2Compiler;
		};

		/**
		 * Get code by file name
		 * @param {string} code
		 */
		Compiler.prototype.getFile = function(name) {
			if (!l2js.files[name]) {
				throw new Error("File [" + name + "] does not exist.");
			}
			return l2js.files[name];
		};

		/**
		 * link external code to pragram
		 * @param {string} code
		 */
		Compiler.prototype.linkCode = function(code) {
			var matched, that = this, replacer = function(match, file) {
				matched = true;
				return "included '" + file + "' {" + that.getFile(file) + "};";
			};

			do {
				matched = false;
				code = code.replace(/include\s+\"([^\"]+)\";/, replacer).replace(/include\s+\'([^\']+)\';/, replacer);
			} while (matched);
			return code;
		};

		Compiler.prototype.compile = function(input) {
			var that = this, q = l2js.core.q, deferred = q.deferred(), code = input;

			function errCb(e) {
				deferred.reject(e);
			}

			setTimeout(function() {
				try {

					that.toAST(code).then(function(ast) {
						that.ASTToJS(ast).then(function(src) {
							deferred.resolve(src);
						}, errCb);
					}, errCb);

				} catch (e) {
					deferred.reject(e);
				}

			}, 0);

			return deferred.promise;
		};

		Compiler.prototype.toAST = function(code) {
			var that = this, q = l2js.core.q, deferred = q.deferred();
			setTimeout(function() {
				try {
					var linkedCode = that.linkCode(code), ast = l2js.compiler.Lparser.parse(linkedCode);
					console.log(ast);
					deferred.resolve(ast);
				} catch (e) {
					deferred.reject(e);
				}
			}, 0);
			return deferred.promise;
		};

		Compiler.prototype.ASTToJS = function(ast) {
			var that = this, q = l2js.core.q, deferred = q.deferred();
			setTimeout(function() {
				try {
					var src = new that.ASTCompiler().visitRoot(ast);
					deferred.resolve(src);

				} catch (e) {
					deferred.reject(e);
				}
			}, 0);
			return deferred.promise;
		};

		Compiler.prototype.ASTToL2 = function(ast) {
			var that = this, deferred = l2js.core.q.deferred();

			setTimeout(function() {
				try {
					var src = new that.L2Compiler(ast).compile();
					deferred.resolve(src);

				} catch (e) {
					deferred.reject(e);
				}
			}, 0);
			return deferred.promise;
		};

		return Compiler;

	})();

	l2js.compiler.Lparser.yy = l2js.compiler.lnodes;
	l2js.compiler.Lparser.yy.ParseError = ParseError;

}(window.l2js);
