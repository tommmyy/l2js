'use strict';

/** 
 * SubLScript wraps LScript for keeping result of last derivation. 
 * Derivation process can be called individually step by step, derivation by derivation respectively. 
 **/

window.l2js && window.l2js.utils && function(l2js) {
	l2js.SubLScript = (function() {

		function SubLScript(lscript, axiom, maxIterations) {
			this.lscript = lscript;
			this.axiom = axiom;
			this.maxIterations = maxIterations || 1;
		}


		SubLScript.prototype.derive = function() {

			var result;
			if (this.derivation) {
				result = new this.lscript().derive(this.derivation, this.maxIterations);
			} else {
				result = new this.lscript().derive(this.axiom, 0);
			}

			this.derivation = result.derivation;
			this.interpretation = result.interpretation;

			return this;

		};

		return SubLScript;

	})();
	
}(window.l2js);