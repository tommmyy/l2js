'use strict';


window.l2js && function(l2js) {
	
	l2js.compile = function(code) {
		return new l2js.compiler.Compiler().compile(code);
	}
	
	l2js.derive = function(lsystemCode) {
		var out = eval(lsystemCode);
		
		return out;
	}

}(window.l2js);