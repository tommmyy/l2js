'use strict';

window.l2js && window.l2js.utils && window.l2js.compiler && function(l2js) {

    /** Helper object for operation over the AST of L2 script */
    l2js.compiler.ASTUtils = (function(l2js) {

        var lnodes = l2js.compiler.lnodes;

        function ASTUtils() {

        }

        /**
         * Finds first match in AST
         *
         * @param {Object} matcher Function that returns true of false. Input parameter is node from AST
         * @param {Object} node Root ASTBlock
         * @param {Object} deep Not yet implemented
         */
        ASTUtils.prototype.findOne = function(matcher, node, deep) {
            if (!node.entries) {
                return;
            }

            var result, i = 0;
            while (!result && i < node.entries.length) {
                if (matcher(node.entries[i])) {
                    result = node.entries[i];
                }
                i++;
            }
            return result;
        };

        /**
         * Finds all matches in AST
         *
         * @param {Object} matcher Function that returns true of false. Input parameter is node from AST
         * @param {Object} node Root ASTBlock
         * @param {Object} deep Not yet implemented
         */
        ASTUtils.prototype.findAll = function(matcher, node, deep) {
            if (!node.entries) {
                return;
            }
            var i = 0,
                out = [];
            while (i < node.entries.length) {
                if (matcher(node.entries[i])) {
                    out.push(node.entries[i]);
                }
                i++;
            }
            return out;
        };

        return ASTUtils;
    })(l2js);

}(window.l2js);
