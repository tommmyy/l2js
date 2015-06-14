'use strict';

window.l2js && window.l2js.utils && window.l2js.compiler && window.l2js.evolver && function(l2js) {

    /** Helper object for operation over the symbols contained in ASTRule object */
    l2js.evolver.RuleUtils = (function(l2js) {

        var lnodes = l2js.compiler.lnodes;

        function RuleUtils() {

        }

        /**
         * Finds all matches in AST
         *
         * @param {Object} matcher Function that returns true of false. Input parameter is node from lnodes
         * @param {Object} node ASTModule, ASTSubLSystem, ASTCall or list of them
         */
        RuleUtils.prototype.findAll = function(matcher, node) {
            var result = [];

            if (node instanceof lnodes.ASTModule || node instanceof lnodes.ASTSubLSystem || node instanceof lnodes.ASTCall) {
                if (matcher(node)) {
                    result.push(node);
                }
            } else if (node instanceof lnodes.ASTStack) {
                if (matcher(node)) {
                    result.push(node);
                }
                var founded = this.findAll(matcher, node.string);
                founded.length && (result = result.concat(founded));
            } else if (node instanceof Array) {
                if (matcher(node)) {
                    result.push(node);
                }
                for (var i = 0; i < node.length; i++) {
                    var founded = this.findAll(matcher, node[i]);
                    founded.length && (result = result.concat(founded));
                }

            }

            return result;
        };

        return RuleUtils;
    })(l2js);

}(window.l2js);
