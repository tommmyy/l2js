'use strict';

/**
 * Compiler compiles L2 code to JavaScript sequence of symbols generated as the
 * result derivation.
 * @class
 */

window.l2js && window.l2js.compiler.Lparser && window.l2js.compiler.lnodes && window.l2js.compiler.ASTCompiler && function(l2js) {

	function ParseError(msg, line) {
		this.msg = msg;
		this.line = line;
	}

	ParseError.prototype.toString = function() {
		return this.msg;
	};

	l2js.compiler.Compiler =  (function()	{
	
		function Compiler() {
			this.ASTCompiler = l2js.compiler.ASTCompiler;
		};
	
	
		/**
		 * Get code by file name
		 * @param {string} code
		 */
		Compiler.prototype.getFile = function(name) {
			if(!l2js.files[name]) {
				throw new Error("File ["+ name +"] does not exist.");
			}
			return l2js.files[name];
		};
		
		/**
		 * link external code to pragram 
		 * @param {string} code
		 */
		Compiler.prototype.linkCode = function(code) {
			var that = this, 
				replacer = function(match, file){
				return that.getFile(file);
			};
			
			return  code
					.replace(/include\s+\"([^\"]+)\";/, replacer)
					.replace(/include\s+\'([^\']+)\';/, replacer);
	
		};
	
		Compiler.prototype.compile = function(input) {
			var that = this, q = l2js.core.q, deferred = q.deferred(), code = input;
	
			setTimeout(function() {
				try {
					var ast, js;
	
					
					var linkedCode = that.linkCode(code);
					ast = that.toAST(linkedCode);
					
					console.log(ast);
	
					js = that.ASTToJS(ast);
					console.log(js);
					
					
								
					deferred.resolve(js);
				} catch (e) {
					deferred.reject(e);
				}
	
			}, 0);
	
			return deferred.promise;
		};
	
		Compiler.prototype.toAST = function(code) {
			return l2js.compiler.Lparser.parse(code);
		};
	
		Compiler.prototype.ASTToJS = function(ast) {
			var src; // generated js source of program
			
			src = new this.ASTCompiler().visitRoot(ast); 
	
	
			return src;
		};
		
		return Compiler;

	})();
	
	l2js.compiler.Lparser.yy = l2js.compiler.lnodes;
	l2js.compiler.Lparser.yy.ParseError = ParseError;

}(window.l2js);