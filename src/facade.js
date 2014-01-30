'use strict';


window.l2js && function(l2js) {
	
	l2js.compile = function(code) {
		var compiler = new l2js.Compiler();
		return compiler.compile(code);
	}

}(window.l2js);