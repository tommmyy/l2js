'use strict';

window.l2js && window.l2js.utils && window.l2js.compiler && window.l2js.compiler.env && function(l2js) {
	
	/**
	 * Abstract LScript class.
	 * 
	 * @class
	 */
	l2js.compiler.env.LScript = (function() {

		function LScript(ctx) {	
			this.ctx = l2js.utils.copy(ctx);	
		}

		/**
		  * @memberOf l2js.LScript
		  */
		LScript.prototype.derive = function(axiom, maxIterations) {
			if(l2js.utils.isUndefined(this.main)) {
				throw new Error('LScript (\'' + this.self.id + '\') has no main call.');
			}
			return new this.main(this.ctx).derive(axiom || this.axiom, maxIterations || this.maxIterations);
		};
		

		
		return LScript;

	})();

	
}(window.l2js);