'use strict';

window.l2js && window.l2js.utils && function(l2js) {

	/**
	 * LScript class.
	 * 
	 * @class
	 */
	l2js.LScript = (function() {

		function LScript() {	
			this.ctx = {};
			this.axiom = [];
			this.maxIterations = 1;
		}

		/**
		  * @memberOf l2js.LScript
		  */
		LScript.prototype.derive = function(axiom, maxIterations) {
			return new this.main(this.ctx).derive(axiom||this.axiom, maxIterations||this.maxIterations);
		};
		
		return LScript;

	})();
	

	
}(window.l2js);