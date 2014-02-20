'use strict';

/**
 * Compiler compiles L2 code to JavaScript sequence of symbols generated as the
 * result derivation.
 * @class
 */

window.l2js && window.l2js.lparser && window.l2js.lnodes && window.l2js.ASTCompiler && function(l2js) {

	function ParseError(msg, line) {
		this.msg = msg;
		this.line = line;
	}

	ParseError.prototype.toString = function() {
		return this.msg;
	};

	l2js.Compiler = function Compiler() {
		this.ASTCompiler = l2js.ASTCompiler;
	};

	l2js.Compiler.prototype.compile = function(input) {
		var that = this, q = l2js.core.q, deferred = q.deferred(), code = input;

		setTimeout(function() {
			try {
				var ast, js;

				ast = that.toAST(code);
				
				console.log(ast);

				js = that.ASTToJS(ast);
				console.log(js);
				
				
							
				deferred.resolve(ast);
			} catch (e) {
				deferred.reject(e);
			}

		}, 0);

		return deferred.promise;
	};

	l2js.Compiler.prototype.toAST = function(code) {
		return l2js.lparser.parse(code);
	};

	l2js.Compiler.prototype.ASTToJS = function(ast) {
		var src; // generated js source of program
		
		src = new this.ASTCompiler().visitRoot(ast); 


		return src;
	};

	
	
	l2js.lparser.yy = l2js.lnodes;
	l2js.lparser.yy.ParseError = ParseError;

}(window.l2js);