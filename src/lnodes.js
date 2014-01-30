'use strict';

/**
 * Core of the library. Provides factory for core objects used by other modules.
 */
window.l2js && function(l2js) {
	
	var lnodes = l2js.lnodes = {};
	
	lnodes.Block = function Block() {
		this.entries = [];
	}
	
	lnodes.Block.prototype.addEntry = function(entry) {
		this.entries.push(entry);
	}
	
	lnodes.ID = function ID(id, type, e) {
		this.id = id;
		this.type = type;
		this.e = e;
	}
	
	lnodes.Operation = function Operation(op, left, right){
		this.op = op;
		this.left = left;
		this.right = right;
	}
	
	lnodes.LSystem = function LSystem(id, alphabet, body){
		this.id = id;
		this.body = body;
		this.alphabet = alphabet;
	};
	
	lnodes.Rule = function Rule(ancestor, successors) {
		this.ancestor = ancestor;
		this.successors = successors;
	}
	
	lnodes.Ancestor = function Ancestor(symbol, args) {
		this.symbol = symbol;
		this.args = args;
	}
	
	lnodes.Successor = function Successor(string, prob) {
		this.string = string;
		this.prob = prob;
	}
	
	lnodes.Module = function Module(symbol, elist) {
		this.symbol = symbol;
		this.elist = elist;
	}
	
	lnodes.Call = function Call(lsystem, axiom, iterations) {
		this.lsystem = lsystem;
		this.axiom = axiom;
		this.iterations = iterations;
		this.main = false;
	}
	
	lnodes.Alphabet = function Alphabet(id, symbols) {
		this.id = id;
		this.symbols = symbols;
	}
	
	
}(window.l2js);