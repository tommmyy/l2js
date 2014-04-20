'use strict';

/**
 * AST nodes for L2
 */
window.l2js && window.l2js.compiler && function(l2js) {
	
	l2js.compiler.lnodes = (function() {
	
		var lnodes = {};
		lnodes.ASTBlock = function ASTBlock() {
			this.entries = [];
			this.isRoot = false;
		};
		
		lnodes.ASTBlock.prototype.addEntry = function(entry) {
			this.entries.push(entry);
		};
		
		lnodes.ASTId = function ASTId(id, type, e) {
			this.id = id;
			this.type = type;
			this.e = e;
		};
		
		lnodes.ASTOperation = function ASTOperation(op, left, right){
			this.op = op;
			this.left = left;
			this.right = right;
		};
		
		lnodes.ASTBrackets= function ASTBrackets(e){
			this.e = e;
		};
		
		lnodes.ASTFunc = function ASTFunc(id, args) {
			this.id = id;
			this.args = args;
		};
		
		lnodes.ASTLSystem = function ASTLSystem(id, alphabet, axiom, maxIterations, body){
			this.id = id;
			this.body = body;
			this.alphabet = alphabet;
			this.axiom = axiom;
			this.maxIterations = maxIterations;
		};
		
		lnodes.ASTLScript = function ASTLScript(id, body){
			this.id = id;
			this.body = body;
		};
		
		lnodes.ASTRule = function ASTRule(ancestor, successors, type) {
			this.ancestor = ancestor;
			this.successors = successors;
			this.type = type;
		};
		
		lnodes.ASTAncestor = function ASTAncestor(symbol, params) {
			this.symbol = symbol;
			this.params = params;
		};
		
		lnodes.ASTSuccessor = function ASTSuccessor(string, probability) {
			this.string = string;
			this.probability = probability;
		};
		
		lnodes.ASTModule = function ASTModule(symbol, args) {
			this.symbol = symbol;
			this.args = args;
		};
		
		lnodes.ASTCall = function ASTCall(lsystem, axiom, maxIterations) {
			this.lsystem = lsystem;
			this.axiom = axiom;
			this.maxIterations = maxIterations;
			this.isMain = false;
		};
		
		lnodes.ASTDerive= function ASTDerive(lscript) {
			this.lscript  = lscript;
		};
		
		lnodes.ASTSubLSystem = function ASTSubLSystem(lsystem, axiom, maxIterations) {
			this.lsystem = lsystem;
			this.axiom = axiom;
			this.maxIterations = maxIterations;
		};
		
		lnodes.ASTAlphabet = function ASTAlphabet(id, symbols) {
			this.id = id;
			this.symbols = symbols;
		};
		
		lnodes.ASTIncluded = function ASTIncluded(file, body) {
			this.file = file;
			this.body = body;
		};
		
		return lnodes;
	
	})();
}(window.l2js);