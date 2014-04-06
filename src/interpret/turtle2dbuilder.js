'use strict';

/**
 * Interpret of the symbols of L-system. Used Builder design pattern. 
 *
 * @class
 */

window.l2js && window.l2js.utils && window.l2js.interpret && function(l2js) {


	l2js.interpret.Turtle2DBuilder =  (function()	{
	
		function Turtle2DBuilder(options) {
			this.options = options;
		};
		
		Turtle2DBuilder.prototype.interpret = function(symbol, ctx) {
			console.log(symbol.id, ctx);
		};
	
		return Turtle2DBuilder;

	})();

}(window.l2js);