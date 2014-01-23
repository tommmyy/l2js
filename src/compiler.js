'use strict';

/**
 * Core of the library. Provides factory for core objects used by other modules.
 */
window.l2js && window.l2js.lparser && function(l2js) {
	l2js.Compiler = function() {
		
	}
	
	l2js.Compiler.prototype.compile = function(code){
		return l2js.lparser.parse(code);
	}
	
}(window.l2js);