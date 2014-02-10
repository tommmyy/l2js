'use strict';

/**
 * Core of the library. Provides factory for core objects used by other modules.
 */
window.l2js && function(l2js) {
	
	var lnodes = l2js.lnodes = {};
	
	lnodes.ASTBlock = function ASTBlock() {
		this.entries = [];
		this.isRoot = false;
	}
	
	lnodes.ASTBlock.prototype.addEntry = function(entry) {
		this.entries.push(entry);
	}
	
	lnodes.ASTID = function ASTID(id, type, e) {
		this.id = id;
		this.type = type;
		this.e = e;
	}
	
	lnodes.ASTOperation = function ASTOperation(op, left, right){
		this.op = op;
		this.left = left;
		this.right = right;
	}
	
	lnodes.ASTLSystem = function ASTLSystem(id, alphabet, axiom, maxIterations, body){
		this.id = id;
		this.body = body;
		this.alphabet = alphabet;
		this.axiom = axiom;
		this.maxIterations = maxIterations;
	};
	
	lnodes.ASTRule = function ASTRule(ancestor, successors, type) {
		this.ancestor = ancestor;
		this.successors = successors;
		this.type = type;
	}
	
	lnodes.ASTAncestor = function ASTAncestor(symbol, params) {
		this.symbol = symbol;
		this.params = params;
	}
	
	lnodes.ASTSuccessor = function ASTSuccessor(string, prob) {
		this.string = string;
		this.prob = prob;
	}
	
	lnodes.ASTModule = function ASTModule(symbol, elist) {
		this.symbol = symbol;
		this.elist = elist;
	}
	
	lnodes.ASTCall = function ASTCall(lsystem, axiom, maxIterations) {
		this.lsystem = lsystem;
		this.axiom = axiom;
		this.maxIterations = maxIterations;
		this.isMain = false;
	}
	
	lnodes.ASTSubLSystem = function ASTSubLSystem(lsystem, axiom, maxIterations) {
		this.lsystem = lsystem;
		this.axiom = axiom;
		this.maxIterations = maxIterations;
	}
	
	lnodes.ASTImport = function ASTImport(lsystem, axiom, iterations) {
		this.lsystem = lsystem;
		this.axiom = axiom;
		this.iterations = iterations;
		this.isMain = false;
	}
	
	lnodes.ASTAlphabet = function ASTAlphabet(id, symbols) {
		this.id = id;
		this.symbols = symbols;
	}
	
	
}(window.l2js);