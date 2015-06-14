'use strict';

window.l2js && window.l2js.utils && window.l2js.compiler && window.l2js.evolver && function(l2js) {

    /** Helper object for operation over the AST of L2 script */
    l2js.evolver.EUtils = (function(l2js) {

        var lnodes = l2js.compiler.lnodes;

        function EUtils() {

        }

        /**
         * Finds first match in AST for the expressions
         *
         * @param {Object} matcher Function that returns true of false. Input parameter is node from lnodes
         * @param {Object} node Root ASTBlock
         */
        EUtils.prototype.findOne = function(matcher, node) {
            var result;

            if (node instanceof lnodes.ASTBrackets) {
                if (matcher(node)) {
                    result = node;
                } else {
                    result = this.findOne(matcher, node.e);
                }
            } else if (node instanceof lnodes.ASTOperation) {
                if (matcher(node)) {
                    result = node;
                } else {
                    result = this.findOne(matcher, node.left) || this.findOne(matcher, node.right);
                }
            } else if (node instanceof lnodes.ASTId && matcher(node)) {
                result = node;
            } else if (node instanceof lnodes.ASTFunc) {
                if (matcher(node)) {
                    result = node;
                }
                // TODO: expand functions
            }

            return result;
        };

        /**
         * Finds all matches in AST
         *
         * @param {Object} matcher Function that returns true of false. Input parameter is node from lnodes
         * @param {Object} node Expression
         */
        EUtils.prototype.findAll = function(matcher, node, level) {
            var result = [];
            level = level || 0;

            if (node instanceof lnodes.ASTBrackets) {
                if (matcher(node, level)) {
                    result.push(node);
                }
                var founded = this.findAll(matcher, node.e, level + 1);
                founded.length && (result = result.concat(founded));

            } else if (node instanceof lnodes.ASTOperation) {
                if (matcher(node, level)) {
                    result.push(node);
                }

                var founded = this.findAll(matcher, node.left, level + 1);
                founded.length && (result = result.concat(founded));

                founded = this.findAll(matcher, node.right, level + 1);
                founded.length && (result = result.concat(founded));

            } else if (node instanceof lnodes.ASTId && matcher(node, level)) {
                result.push(node);
            } else if (node instanceof lnodes.ASTFunc) {
                if (matcher(node, level)) {
                    result.push(node);
                }
                // TODO: expand functions

            } else if (node instanceof lnodes.ASTRef) {
                if (matcher(node, level)) {
                    result.push(node);
                }
            } else if (typeof node === "number") {
                if (matcher(node, level)) {
                    result.push(node, level);
                }
            }

            return result;
        };

        EUtils.prototype.isTerminal = function(node) {
            return (node instanceof lnodes.ASTRef) || (node instanceof lnodes.ASTId) || (node instanceof lnodes.ASTFunc);
        };

        EUtils.prototype.findAllTerminals = function(node) {
            var that = this;
            var terms = this.findAll(function(node) {
                return that.isTerminal(node);
            }, node);
            return terms;
        };

        return EUtils;
    })(l2js);

}(window.l2js);
