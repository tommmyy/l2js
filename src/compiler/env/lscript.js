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
            this.type = "lscript";
        }

        /**
         * @memberOf l2js.LScript
         */
        LScript.prototype.derive = function(axiom, maxIterations) {
            this.ctx.stats.numberOfDerivedSymbols = 0;
            var der = new this.main(this.ctx);
            return der.derive(axiom || this.axiom, maxIterations || this.maxIterations);

        };

        return LScript;

    })();

}(window.l2js);
