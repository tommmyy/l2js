'use strict';

window.l2js && function(l2js) {

	l2js.compile = function(code) {
		return new l2js.compiler.Compiler().compile(code);
	};

	l2js.derive = function(lsystemCode) {
		var out = eval(lsystemCode);
		console.log(out.interpretation);
		return out;
	};

	l2js.interpretAll = function(symbols, options) {
		return new l2js.interpret.Interpret(symbols, options).all();
	};

	l2js.format = function(lsystemCode) {
		var deferred = l2js.core.q.deferred();
		setTimeout(function() {
			var errHandler = function(err) {
				deferred.reject(err);
			};
			try {
				var compiler = new l2js.compiler.Compiler();

				compiler.toAST(lsystemCode).then(function(ast) {
					compiler.ASTToL2(ast).then(function(l2) {
						deferred.resolve(l2);
					}, errHandler);
				}, errHandler);
			} catch(e) {
				errHandler(e);
			}

		}, 0);

		return deferred.promise;
	};
	
	l2js.mutate = function() {
		
	};
	
}(window.l2js);
