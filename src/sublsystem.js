'use strict';

/** 
 * SubLSystem wraps LSystem for keeping result of last derivation. 
 * Derivation process can be called individually step by step, derivation by derivation respectively. 
 **/

window.l2js && window.l2js.utils && function(l2js) {
	l2js.SubLSystem = (function() {

		function SubLSystem(lsystem, axiom, maxIterations) {
			this.lsystem = lsystem;
			this.axiom = axiom;
			this.maxIterations = maxIterations || 1;
		}


		SubLSystem.prototype.derive = function() {

			var result;
			if (this.derivation) {
				result = new this.lsystem().derive(this.derivation, this.maxIterations);
			} else {
				result = new this.lsystem().derive(this.axiom, 0);
			}

			this.derivation = result.derivation;
			this.interpretation = result.interpretation;

			return this;

		};

		return SubLSystem;

	})();
	
}(window.l2js);