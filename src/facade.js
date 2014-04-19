'use strict';


window.l2js && function(l2js) {
	
	l2js.compile = function(code) {
		return new l2js.compiler.Compiler().compile(code);
	}
	
	l2js.derive = function(lsystemCode) {
		var out = eval(lsystemCode);		
		return out;
	}
	
	l2js.interpretAll = function(symbols, options) {
		return new l2js.interpret.Interpret(symbols, options).all();
	}

}(window.l2js);