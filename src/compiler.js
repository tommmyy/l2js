'use strict';

/**
 * Core of the library. Provides factory for core objects used by other modules.
 */
window.l2js && window.l2js.lparser && function(l2js) {
	l2js.lparser.yy = l2js.lnodes;
	
	l2js.Compiler = function() {
		
	}

	l2js.Compiler.prototype.compile = function(input) {
		var q = l2js.core.q, deferred = q.deferred(), code = input;

		setTimeout(function() {
			try {
				var ast = l2js.lparser.parse(code);
				
				deferred.resolve(ast);
			} catch (e) {
				deferred.reject(e);
			}
			
		}, 0);

		return deferred.promise;
	}
	




}(window.l2js);