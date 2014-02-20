'use strict';


window.l2js && function(l2js) {
	
	l2js.compile = function(code) {
		return new l2js.Compiler().compile(code);
	}

}(window.l2js);