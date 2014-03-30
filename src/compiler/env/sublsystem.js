'use strict';

/** 
 * SubLSystem wraps LSystem for keeping result of last derivation. 
 * Derivation process can be called individually step by step, derivation by derivation respectively. 
 **/

window.l2js && window.l2js.utils && function(l2js) {
	l2js.compiler = l2js.compiler || {};
	l2js.compiler.env = l2js.compiler.env || {};
	
	l2js.compiler.env.SubLSystem = (function() {

		/**
		 * @param ctx context for variables
		 * @param lsystem Prototype of lsystem for wrapping
		 * @param axiom
		 * @param maxIterations
		 */
		function SubLSystem(ctx, lsystem, axiom, maxIterations) {
			this.lsystem = lsystem;
			this.ctx = ctx;
			this.axiom = axiom;
			this.maxIterations = maxIterations;
		}


		SubLSystem.prototype.derive = function() {

			var result;
			if(!this.lsystemInst) {
				this.lsystemInst = new this.lsystem(this.ctx);
			}
			if (this.derivation) {
				result = this.lsystemInst.derive(this.derivation, this.maxIterations);
			} else {
				result = this.lsystemInst.derive(this.axiom, this.maxIterations);
				this.axiom = result.axiom; // axiom used in the first iteration
			}
			
			this.derivation = result.derivation;
			this.interpretation = result.interpretation;

			return this;

		};

		return SubLSystem;

	})();
	
}(window.l2js);