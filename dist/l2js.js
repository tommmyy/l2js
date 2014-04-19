/*!
* L-System to Javascript Library v0.0.2
*
* Copyright 2013, 2013 Tomáš Konrády (tomas.konrady@uhk.cz)
* Released under the MIT license
*
* Date: 2014-04-19T11:32:23.872Z
*/

(function( global, factory ) {'use strict';

        if ( typeof module === "object" && typeof module.exports === "object" ) {
                // For CommonJS and CommonJS-like environments where a proper window is present,
                // execute the factory and get jQuery
                // For environments that do not inherently posses a window with a document
                // (such as Node.js), expose a jQuery-making factory as module.exports
                // This accentuates the need for the creation of a real window
                // e.g. var jQuery = require("jquery")(window);
                // See ticket #14549 for more info
                module.exports = global.document ?
                        factory( global ) :
                        function( w ) {
                                if ( !w.document ) {
                                        throw new Error( "l2js requires a window with a document" );
                                }
                                return factory( w );
                        };
        } else {
                factory( global );
        }

// Pass this, window may not be defined yet
}(this, function( window ) {

var _l2js = window.l2js;
window.l2js = window.l2js || (window.l2js = {});
window.l2js.files = {};

/**
 * Core of the library. Provides factory for core objects used by other modules.
 */


	l2js.core = l2js.core  || {};

/**
 * Promise object inspired by {@link http://docs.angularjs.org/api/ng.$q}
 */



	
	
	/** Promise */
	l2js.core.Promise = function Promise(deferred) {
		this.deferred = deferred;
	}
	
	l2js.core.Promise.prototype.then = function(successCallback, errorCallback) {
		
		this.deferred.successCallback = successCallback;
		this.deferred.errorCallback = errorCallback;
		
		this.result = l2js.core.q.deferred();
		return this.result.promise;
		
	};
	
	l2js.core.Promise.prototype.catch = function(errorCallback) {
		this.deferred.errorCallback = errorCallback;
	};
	
	
	/**
	 * Deffered
	 */
	l2js.core.Deferred = function() {
		this.promise = new l2js.core.Promise(this);
	}


	l2js.core.Deferred.prototype.reject = function(reason) {
		var chainReason = this.errorCallback(reason);
		if(typeof chainReason !== 'undefined') {
			this.promise.result.reject(chainReason);	
		}
	}

	l2js.core.Deferred.prototype.resolve = function(value) {
		var chainValue = this.successCallback(value);
		if(typeof chainValue !== 'undefined') {
			this.promise.result.resolve(chainValue);	
		}
		
	}
	
	l2js.core.q = {
		/** Factory for deffered object */
		deferred : function() {
			return new l2js.core.Deferred();
		}
	};

/**
 * Utility methods
 */


	
	l2js.utils = {
		copy: function (obj) {
			if (l2js.utils.isUndefined(obj) || typeof obj !== "object") {
				return obj;
			}

			var out = new obj.constructor();

			for (var key in obj) {
				out[key] = l2js.utils.copy(obj[key]);
			}
			return out;
		},

		hasProp: {}.hasOwnProperty,

		// coffeescript
		extend: function (child, parent) {
			for (var key in parent) {
				if (l2js.utils.hasProp.call(parent, key))
					child[key] = parent[key];
			}
			function ctor() {
				this.constructor = child;
			}


			ctor.prototype = parent.prototype;
			child.prototype = new ctor();
			child.__super__ = parent.prototype;
			return child;
		},

		// prototype
		indexOf: function (arr, item, i) {
			i || ( i = 0);
			var length = arr.length;
			if (i < 0)
				i = length + i;
			for (; i < length; i++)
				if (arr[i] === item)
					return i;
			return -1;
		},

		isUndefined: function (v) {
			return typeof v === 'undefined';
		}, 
		isFunction:function (functionToCheck) {
		 var getType = {};
		 return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
		},
		toUpperFirstLetter: function (string) {
		    return string.charAt(0).toUpperCase() + string.slice(1);
		},
		/** 
		 * http://xazure.net/2011/06/tips-snippets/javascript/padding-string-in-javascript/ 
		 * @param str - The string to pad. 
		 * @param padChar - The character to pad the string with. 
		 * @param length - The length of the resulting string. 
		 *
		 * @return The padded string. 
		 */ 
		padLeft: function (str, padChar, length) { 
		
		    while(str.length < length) 
		        str = padChar + str;
		    return str; 
		} 	
	};

l2js.compiler = l2js.compiler || {};

l2js.compiler.env = l2js.compiler.env || {};

/**
	 * Alphabet determines what symbols are used by a L-system.
	 * 
	 * @class
	 */
	l2js.compiler.env.Alphabet = (function() {
		function Alphabet(id, symbols) {
			this.id = id;
			this.symbols = symbols;
		}

		/**
		 * @memberOf l2js.Alphabet
		 */
		Alphabet.prototype.hasSymbol = function(symbol) {
			if (!this.symbols && !symbol) {
				return false;
			}
			return (this.symbols && symbol)
					&& l2js.utils.indexOf(this.symbols, symbol) !== -1;
		};

		return Alphabet;
	})();

/** 
 * SubLSystem wraps LSystem for keeping result of last derivation. 
 * Derivation process can be called individually step by step, derivation by derivation respectively. 
 **/



	
	l2js.compiler.env.SubLSystem = (function() {

		/**
		 * @param ctx context for variables
		 * @param lsystem Prototype of lsystem for wrapping
		 * @param axiom
		 * @param maxIterations
		 */
		function SubLSystem(ctx, lsystem, axiom, maxIterations) {
			this.ctx = ctx;
			this.lsystem = lsystem;
			
			if(typeof axiom === "number") {
				maxIteration = axiom;
				axiom = undefined;
			}
			
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

/**
	 * Abstract LSystem class.
	 * 
	 * @class
	 */
	l2js.compiler.env.LSystem = (function(l2js) {

		function LSystem(ctx) {
			this.ctx = ctx?l2js.utils.copy(ctx):{};
			this.rulesProbabilities = {};
		}
		
		/*
		LSystem.prototype.axiom = [];
		LSystem.prototype.maxIterations = 1;
		LSystem.prototype.self = LSystem;
		*/
		
				
		/**
		 * @memberOf l2js.compiler.env.LSystem
		 */
		LSystem.prototype.checkAlphabetSymbol = function(symbol) {
//			if (!this.self.alphabet.hasSymbol(symbol)) {
//				throw Error("Alphabet '" + this.self.alphabet.name + "' (used in '" + this.name + "') does not contain symbol '" + symbol + "'.");
//			}
		};

		// derive() derive([]) derive(2) derive([], 2)
		/**
		  * @memberOf l2js.compiler.env.LSystem
		  */
		LSystem.prototype.derive = function(axiom, maxIterations) {
			if (arguments.length === 0) {
				axiom = this.axiom();
				maxIterations = this.maxIterations;
			} else if (arguments.length === 1) {
				if ( typeof axiom === "number") {
					maxIterations = arguments[0];
					axiom = this.axiom();
				} else {
					maxIterations = this.maxIterations;
				}
			} else if (arguments.length === 2) {
				axiom = axiom || this.axiom();
				maxIterations = l2js.utils.isUndefined(maxIterations)? this.maxIterations:maxIterations;
			}

			var i, 
				max = maxIterations + 1, // + axiom			
				out = {
					axiom : axiom,
					totalIterations: maxIterations,
					derivations : [],
					interpretations : []
				};
			for ( i = 0; i < max; i++) {

				out.derivation = out.derivation ? this.deriveModule(out.derivation, "-") : axiom;
				out.interpretation = this.deriveModule(out.derivation, "h");

				// add to history
				// if (i !== 0) {
					out.derivations.push(l2js.utils.copy(out.derivation));
					out.interpretations.push(l2js.utils.copy(out.interpretation));
				// }
			}

			return out;
		};
		
		/**
		  * @memberOf l2js.compiler.env.LSystem
		  */
		LSystem.prototype.deriveModule = function(ancestor, type) {
			var successor = [], j;
			for ( j = 0; j < ancestor.length; j++) {

				if (l2js.utils.isUndefined(ancestor[j])) {
					throw Error("Undefined ancestor.");
				}

				// Sub-L-systems should be derived only in main derivation
				if (ancestor[j] instanceof l2js.compiler.env.SubLSystem) {
					type === "-" && successor.push(l2js.utils.copy(ancestor[j]).derive()) || successor.push(l2js.utils.copy(ancestor[j]));
				} else {
					var symbol = ancestor[j];
					this.checkAlphabetSymbol(symbol.symbol);
					successor = successor.concat(this.findDerivation(symbol, type));
				}
			}
			return successor;
		};
		
		/**
		  * @memberOf l2js.compiler.env.LSystem
		  */
		LSystem.prototype.findDerivation = function(toDerive, ruleType) {
			var hash = LSystem.makeHash(toDerive, ruleType);
			
			if (!l2js.utils.isUndefined(this.rules[hash])) {
				var rules = this.rules[hash];

				if(l2js.utils.isUndefined(this.rulesProbabilities[hash])) {
					this.rulesProbabilities[hash] = 0;
					for ( i = 0; i < rules.length; i++) {
						var rule = rules[i];
						this.rulesProbabilities[hash] += rule.probability;
					}
				}
				if(this.rulesProbabilities[hash] !== 0) {
					var threshold = Math.random() * this.rulesProbabilities[hash], i, sum = 0;
	
					for ( i = 0; i < rules.length; i++) {
						var rule = rules[i];
	
						sum += rule.probability;
						if (threshold <= sum) {
							return rule.successor.apply(this, toDerive.arguments);
						}
					}
				
				}
			
			} 
			return [toDerive]; //identity
		};

		/** Static */
		
		/**
		 * Creates hash of the module.
		 * 
		 * @param {object} module - Module for which hash is returned
		 * @param {string} ruleType - Either '-' or 'h', default is '-'
		 * 
		 * @returns {string} Hash of the module
		 * @memberOf l2js.compiler.env.LSystem
		 */
		LSystem.makeHash = function(module, ruleType) {
			var args = module.arguments || module.params || [], hash = "";
			l2js.utils.isUndefined(ruleType) && (ruleType = '-');
			
			var i;
			for ( i = 0; i < args.length; i++) {
				hash += l2js.utils.isUndefined(args[i]) ? 0 : 1;
			}

			return ruleType + "@" + hash + "_" + module.symbol;
		};
		
		/**
		 * Factory method for the instance of the module
		 * 
		 * @param {string} symbol - Symbol of the alphabet
		 * @param {array} args - Array of the arguments for the module
		 * @param {string} alphabet - Name of the alphabet for the symbol 
		 * 
		 * @returns {object} Instance of the module 
		 * @memberOf l2js.compiler.env.LSystem
		 */
		LSystem.getModule = function(symbol, args, alphabet){
			return {
				alphabet : alphabet,
				symbol : symbol,
				arguments : args
			};
		};
		
		/**
		 * Factory method for the declaration of the module
		 * 
		 * @param {string} symbol - Symbol of alphabet
		 * @param {array} params - Array of names of the parameters for the module
		 * @param {string} alphabet - Name of the alphabet for the symbol 
		 * 
		 * @returns {object} Declaration of the module 
		 * @memberOf l2js.compiler.env.LSystem
		 */
		LSystem.getParamModule = function(symbol, params, alphabet){
			return {
				alphabet : alphabet,
				symbol : symbol,
				params : params
			};
		};

		LSystem.id = "";
		LSystem.alphabet = {};
		
		return LSystem;

	})(l2js);

/**
	 * Abstract LScript class.
	 * 
	 * @class
	 */
	l2js.compiler.env.LScript = (function() {

		function LScript(ctx) {	
			this.ctx = l2js.utils.copy(ctx);	
		}

		/**
		  * @memberOf l2js.LScript
		  */
		LScript.prototype.derive = function(axiom, maxIterations) {
			if(l2js.utils.isUndefined(this.main)) {
				throw new Error('LScript (\'' + this.self.id + '\') has no main call.');
			}
			return new this.main(this.ctx).derive(axiom || this.axiom, maxIterations || this.maxIterations);
		};
		

		
		return LScript;

	})();

/** 
 * SubLScript wraps LScript for keeping result of last derivation. 
 * Derivation process can be called individually step by step, derivation by derivation respectively. 
 **/



	
	l2js.compiler.env.SubLScript = (function() {

		function SubLScript(lscript, axiom, maxIterations) {
			this.lscript = lscript; // instance
			this.axiom = axiom;
			this.maxIterations = maxIterations;
		}


		SubLScript.prototype.derive = function() {

			var result;
			if (this.derivation) {
				result = this.lscript.derive(this.derivation, this.maxIterations);
			} else {
				result = this.lscript.derive(this.axiom, this.maxIterations);
				this.axiom = result.axiom;
			}

			this.derivation = result.derivation;
			this.interpretation = result.interpretation;

			return this;
		};

		return SubLScript;

	})();

/**
 * AST nodes for L2
 */


	
	l2js.compiler.lnodes = (function() {
	
		var lnodes = {};
		lnodes.ASTBlock = function ASTBlock() {
			this.entries = [];
			this.isRoot = false;
		}
		
		lnodes.ASTBlock.prototype.addEntry = function(entry) {
			this.entries.push(entry);
		}
		
		lnodes.ASTId = function ASTId(id, type, e) {
			this.id = id;
			this.type = type;
			this.e = e;
		}
		
		lnodes.ASTOperation = function ASTOperation(op, left, right){
			this.op = op;
			this.left = left;
			this.right = right;
		}
		
		lnodes.ASTBrackets= function ASTBrackets(e){
			this.e = e;
		}
		
		lnodes.ASTFunc = function ASTFunc(id, args) {
			this.id = id;
			this.args = args;
		}
		
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
		}
		
		lnodes.ASTAncestor = function ASTAncestor(symbol, params) {
			this.symbol = symbol;
			this.params = params;
		}
		
		lnodes.ASTSuccessor = function ASTSuccessor(string, probability) {
			this.string = string;
			this.probability = probability;
		}
		
		lnodes.ASTModule = function ASTModule(symbol, args) {
			this.symbol = symbol;
			this.args = args;
		}
		
		lnodes.ASTCall = function ASTCall(lsystem, axiom, maxIterations) {
			this.lsystem = lsystem;
			this.axiom = axiom;
			this.maxIterations = maxIterations;
			this.isMain = false;
		}
		
		lnodes.ASTDerive= function ASTDerive(lscript) {
			this.lscript  = lscript;
		}
		
		lnodes.ASTSubLSystem = function ASTSubLSystem(lsystem, axiom, maxIterations) {
			this.lsystem = lsystem;
			this.axiom = axiom;
			this.maxIterations = maxIterations;
		}
		
		lnodes.ASTAlphabet = function ASTAlphabet(id, symbols) {
			this.id = id;
			this.symbols = symbols;
		}
		
		return lnodes;
	
	})();


/* parser generated by jison 0.4.13 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/


l2js.compiler.Lparser = (function(){
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"program":3,"program_entries":4,"EOF":5,"stmts":6,"stmt":7,";":8,"var":9,"=":10,"e":11,"symbol":12,"text":13,"LSCRIPT":14,"id":15,"{":16,"}":17,"LSYSTEM":18,"(":19,"axiom":20,")":21,"USING":22,",":23,"number":24,"ALPHABET":25,"symbols":26,"ancestor":27,"RULE_OP":28,"successors":29,"H_RULE_OP":30,"main_call":31,"sublsystem":32,"call":33,"DERIVE":34,"SUBLSYSTEM":35,"CALL":36,"MAIN":37,"string":38,"iterations":39,"params":40,"successor":41,"|":42,":":43,"module":44,"arguments":45,"param":46,"ID":47,"VAR":48,"+":49,"term":50,"-":51,"*":52,"factor":53,"/":54,"FUNC":55,"E":56,"PI":57,"TEXT":58,"NUMBER":59,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",8:";",10:"=",14:"LSCRIPT",16:"{",17:"}",18:"LSYSTEM",19:"(",21:")",22:"USING",23:",",25:"ALPHABET",28:"RULE_OP",30:"H_RULE_OP",34:"DERIVE",35:"SUBLSYSTEM",36:"CALL",37:"MAIN",42:"|",43:":",47:"ID",48:"VAR",49:"+",51:"-",52:"*",54:"/",55:"FUNC",56:"E",57:"PI",58:"TEXT",59:"NUMBER"},
productions_: [0,[3,2],[4,1],[6,3],[6,1],[6,0],[7,3],[7,3],[7,1],[7,5],[7,10],[7,12],[7,5],[7,3],[7,3],[7,1],[7,1],[7,1],[7,2],[32,5],[32,7],[32,6],[32,4],[33,5],[33,7],[33,6],[33,4],[31,2],[20,1],[39,1],[27,4],[27,1],[29,3],[29,1],[41,3],[41,1],[38,2],[38,1],[44,4],[44,1],[44,1],[44,1],[45,3],[45,2],[45,1],[45,0],[40,3],[40,2],[40,1],[40,0],[46,1],[26,3],[26,1],[26,0],[12,1],[9,1],[15,1],[11,3],[11,3],[11,1],[50,3],[50,3],[50,1],[53,4],[53,1],[53,1],[53,1],[53,1],[53,3],[13,1],[24,1]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1: 
        	// TODO: add restrictions only to valid statements
            /*var i;
			for(i = 0; i < $stmts.length; i++) {
				var errMsg,stmt = $stmts[i];
				if( stmt instanceof yy.ASTRule) {
					errMsg = 'Main program should not contain rule declaration.';
				} else if(stmt instanceof yy.ASTCall && !stmt.isMain) {
					errMsg = 'In global scope use only main call.';
				} 
				
				if(typeof errMsg !== 'undefined') {
					throw new yy.ParseError('Parse error on ' + this._$.first_line + ':' + this._$.last_column + '. ' + errMsg );
				}
			}*/
			
        	var block = new yy.ASTBlock(); 
        	block.isRoot = true;
        	block.entries = $$[$0-1]; 
        	return block; 
        
break;
case 2:this.$ = $$[$0];
break;
case 3:this.$ = $$[$0]; this.$.unshift($$[$0-2]);
break;
case 4:this.$ = [$$[$0]];
break;
case 5:this.$ = [];
break;
case 6:this.$ = $$[$0-2]; this.$.e = $$[$0];
break;
case 7:this.$ = $$[$0-2];this.$.e = $$[$0];
break;
case 8:this.$ = $$[$0];
break;
case 9:
			// TODO: add restrictions only to valid statements
			var block = new yy.ASTBlock();
			block.entries = $$[$0-1];
			
			this.$ = new yy.ASTLScript($$[$0-3], block); 
		
break;
case 10:
			var block = new yy.ASTBlock(); 
			block.entries = $$[$0-1];
			this.$ = new yy.ASTLSystem($$[$0-8], $$[$0-3], $$[$0-6], undefined , block);
		
break;
case 11:
			if($$[$0-6] % 1 !== 0) {
				var errMsg = "Number of iterations should be integer.";
				throw new yy.ParseError('Parse error on ' + this._$.first_line + ':' + this._$.last_column + '. ' + errMsg );
			}
			var block = new yy.ASTBlock(); 
			block.entries = $$[$0-1];
			this.$ = new yy.ASTLSystem($$[$0-10], $$[$0-3], $$[$0-8], $$[$0-6], block);
		
break;
case 12:
			$$[$0-3].type='alphabet';
			this.$ = new yy.ASTAlphabet($$[$0-3], $$[$0-1]);
		
break;
case 13:this.$ = new yy.ASTRule($$[$0-2], $$[$0]);
break;
case 14:this.$ = new yy.ASTRule($$[$0-2], $$[$0], 'h');
break;
case 15:this.$ = $$[$0];
break;
case 16:this.$ = $$[$0];
break;
case 17:this.$ = $$[$0];
break;
case 18:this.$ = new yy.ASTDerive($$[$0]);
break;
case 19:$$[$0-3].type="lsystem"; this.$ = new yy.ASTSubLSystem($$[$0-3], $$[$0-1]);
break;
case 20:
			$$[$0-5].type="lsystem"; this.$ = new yy.ASTSubLSystem($$[$0-5], $$[$0-3], $$[$0-1]);
		
break;
case 21:
		
			$$[$0-4].type="lsystem"; this.$ = new yy.ASTSubLSystem($$[$0-4], undefined, $$[$0-1]);
		
break;
case 22:$$[$0-2].type="lsystem"; this.$ = new yy.ASTSubLSystem($$[$0-2]);
break;
case 23:$$[$0-3].type="lsystem"; this.$ = new yy.ASTCall($$[$0-3], $$[$0-1]);
break;
case 24:
			$$[$0-5].type="lsystem"; this.$ = new yy.ASTCall($$[$0-5], $$[$0-3], $$[$0-1]);
		
break;
case 25:
			$$[$0-4].type="lsystem"; this.$ = new yy.ASTCall($$[$0-4], undefined, $$[$0-1]);
		
break;
case 26:$$[$0-2].type="lsystem"; this.$ = new yy.ASTCall($$[$0-2]);
break;
case 27:this.$ = $$[$0]; this.$.isMain = true;
break;
case 28:this.$ = $$[$0]
break;
case 29:
			if($$[$0] % 1 !== 0) {
				var errMsg = "Number of iterations should be integer.";
				throw new yy.ParseError('Parse error on ' + this._$.first_line + ':' + this._$.last_column + '. ' + errMsg );
			}
			this.$ = $$[$0];
		
break;
case 30:this.$ = new yy.ASTAncestor($$[$0-3], $$[$0-1]);
break;
case 31:this.$ = new yy.ASTAncestor($$[$0]);
break;
case 32:this.$ = $$[$0]; this.$.unshift($$[$0-2]);
break;
case 33:this.$ = [$$[$0]];
break;
case 34:this.$ = new yy.ASTSuccessor($$[$0-2], $$[$0]);
break;
case 35:this.$ = new yy.ASTSuccessor($$[$0]);
break;
case 36:this.$ = $$[$0]; this.$.unshift($$[$0-1]);
break;
case 37:this.$ = [$$[$0]];
break;
case 38:$$[$0-3].type="symbol"; this.$ = new yy.ASTModule($$[$0-3], $$[$0-1]);
break;
case 39:$$[$0].type="symbol"; this.$ =  new yy.ASTModule($$[$0]);
break;
case 40:this.$ = $$[$0];
break;
case 41:this.$ = $$[$0];
break;
case 42:this.$ = $$[$0]; this.$.unshift($$[$0-2]);
break;
case 43:this.$ = $$[$0]; this.$.unshift(undefined);
break;
case 44:this.$ = [$$[$0]];
break;
case 45:this.$ = [];
break;
case 46:this.$ = $$[$0]; this.$.unshift($$[$0-2]);
break;
case 47:this.$ = $$[$0]; this.$.unshift(undefined);
break;
case 48:this.$ = [$$[$0]];
break;
case 49:this.$ = [];
break;
case 50: this.$ = new yy.ASTId($$[$0], 'param');
break;
case 51:this.$ = $$[$0]; this.$.unshift($$[$0-2]);
break;
case 52:this.$ = [$$[$0]];
break;
case 53:this.$ = [];
break;
case 54: this.$ = $$[$0]; this.$.type='symbol';
break;
case 55: this.$ = new yy.ASTId($$[$0], 'var'); 
break;
case 56: this.$ = new yy.ASTId($$[$0]); 
break;
case 57:this.$ = new yy.ASTOperation($$[$0-1], $$[$0-2], $$[$0]);
break;
case 58:this.$ = new yy.ASTOperation($$[$0-1], $$[$0-2], $$[$0]);
break;
case 59:this.$ = $$[$0];
break;
case 60:this.$ = new yy.ASTOperation($$[$0-1], $$[$0-2], $$[$0]);
break;
case 61:this.$ = new yy.ASTOperation($$[$0-1], $$[$0-2], $$[$0]);
break;
case 62:this.$ = $$[$0];
break;
case 63:this.$ = new yy.ASTFunc($$[$0-3], $$[$0-1]);
break;
case 64:this.$ = $$[$0];
break;
case 65:this.$ = Math.E;
break;
case 66:this.$ = Math.PI;
break;
case 67:this.$ = $$[$0];
break;
case 68:this.$ = new yy.ASTBrackets($$[$0-1]);
break;
case 69:this.$ = String(yytext);
break;
case 70:this.$ =  Number(yytext);
break;
}
},
table: [{3:1,4:2,5:[2,5],6:3,7:4,9:5,11:7,12:6,14:[1,8],15:17,18:[1,9],19:[1,28],24:25,25:[1,10],27:11,31:12,32:13,33:14,34:[1,15],35:[1,20],36:[1,21],37:[1,19],47:[1,22],48:[1,16],50:18,53:23,55:[1,24],56:[1,26],57:[1,27],59:[1,29]},{1:[3]},{5:[1,30]},{5:[2,2]},{5:[2,4],8:[1,31],17:[2,4]},{5:[2,67],8:[2,67],10:[1,32],17:[2,67],49:[2,67],51:[2,67],52:[2,67],54:[2,67]},{10:[1,33],19:[1,34],28:[2,31],30:[2,31]},{5:[2,8],8:[2,8],17:[2,8],49:[1,35],51:[1,36]},{15:37,47:[1,22]},{15:38,47:[1,22]},{15:39,47:[1,22]},{28:[1,40],30:[1,41]},{5:[2,15],8:[2,15],17:[2,15]},{5:[2,16],8:[2,16],17:[2,16]},{5:[2,17],8:[2,17],17:[2,17]},{15:42,47:[1,22]},{5:[2,55],8:[2,55],10:[2,55],17:[2,55],21:[2,55],23:[2,55],49:[2,55],51:[2,55],52:[2,55],54:[2,55]},{10:[2,54],17:[2,54],19:[2,54],23:[2,54],28:[2,54],30:[2,54]},{5:[2,59],8:[2,59],17:[2,59],21:[2,59],23:[2,59],49:[2,59],51:[2,59],52:[1,43],54:[1,44]},{33:45,36:[1,21]},{15:46,47:[1,22]},{15:47,47:[1,22]},{5:[2,56],8:[2,56],10:[2,56],16:[2,56],17:[2,56],19:[2,56],21:[2,56],23:[2,56],28:[2,56],30:[2,56],35:[2,56],36:[2,56],42:[2,56],43:[2,56],47:[2,56]},{5:[2,62],8:[2,62],17:[2,62],21:[2,62],23:[2,62],49:[2,62],51:[2,62],52:[2,62],54:[2,62]},{19:[1,48]},{5:[2,64],8:[2,64],17:[2,64],21:[2,64],23:[2,64],49:[2,64],51:[2,64],52:[2,64],54:[2,64]},{5:[2,65],8:[2,65],17:[2,65],21:[2,65],23:[2,65],49:[2,65],51:[2,65],52:[2,65],54:[2,65]},{5:[2,66],8:[2,66],17:[2,66],21:[2,66],23:[2,66],49:[2,66],51:[2,66],52:[2,66],54:[2,66]},{9:50,11:49,19:[1,28],24:25,48:[1,16],50:18,53:23,55:[1,24],56:[1,26],57:[1,27],59:[1,29]},{5:[2,70],8:[2,70],17:[2,70],21:[2,70],23:[2,70],42:[2,70],49:[2,70],51:[2,70],52:[2,70],54:[2,70]},{1:[2,1]},{5:[2,5],6:51,7:4,9:5,11:7,12:6,14:[1,8],15:17,17:[2,5],18:[1,9],19:[1,28],24:25,25:[1,10],27:11,31:12,32:13,33:14,34:[1,15],35:[1,20],36:[1,21],37:[1,19],47:[1,22],48:[1,16],50:18,53:23,55:[1,24],56:[1,26],57:[1,27],59:[1,29]},{9:50,11:52,19:[1,28],24:25,48:[1,16],50:18,53:23,55:[1,24],56:[1,26],57:[1,27],59:[1,29]},{13:53,58:[1,54]},{21:[2,49],23:[1,57],40:55,46:56,47:[1,58]},{9:50,19:[1,28],24:25,48:[1,16],50:59,53:23,55:[1,24],56:[1,26],57:[1,27],59:[1,29]},{9:50,19:[1,28],24:25,48:[1,16],50:60,53:23,55:[1,24],56:[1,26],57:[1,27],59:[1,29]},{16:[1,61]},{19:[1,62]},{16:[1,63]},{15:68,29:64,32:70,33:69,35:[1,20],36:[1,21],38:66,41:65,44:67,47:[1,22]},{15:68,29:71,32:70,33:69,35:[1,20],36:[1,21],38:66,41:65,44:67,47:[1,22]},{5:[2,18],8:[2,18],17:[2,18]},{9:50,19:[1,28],24:25,48:[1,16],53:72,55:[1,24],56:[1,26],57:[1,27],59:[1,29]},{9:50,19:[1,28],24:25,48:[1,16],53:73,55:[1,24],56:[1,26],57:[1,27],59:[1,29]},{5:[2,27],8:[2,27],17:[2,27]},{19:[1,74]},{19:[1,75]},{9:50,11:77,19:[1,28],21:[2,45],23:[1,78],24:25,45:76,48:[1,16],50:18,53:23,55:[1,24],56:[1,26],57:[1,27],59:[1,29]},{21:[1,79],49:[1,35],51:[1,36]},{5:[2,67],8:[2,67],17:[2,67],21:[2,67],23:[2,67],49:[2,67],51:[2,67],52:[2,67],54:[2,67]},{5:[2,3],17:[2,3]},{5:[2,6],8:[2,6],17:[2,6],49:[1,35],51:[1,36]},{5:[2,7],8:[2,7],17:[2,7]},{5:[2,69],8:[2,69],17:[2,69]},{21:[1,80]},{21:[2,48],23:[1,81]},{21:[2,49],23:[1,57],40:82,46:56,47:[1,58]},{21:[2,50],23:[2,50]},{5:[2,57],8:[2,57],17:[2,57],21:[2,57],23:[2,57],49:[2,57],51:[2,57],52:[1,43],54:[1,44]},{5:[2,58],8:[2,58],17:[2,58],21:[2,58],23:[2,58],49:[2,58],51:[2,58],52:[1,43],54:[1,44]},{6:83,7:4,9:5,11:7,12:6,14:[1,8],15:17,17:[2,5],18:[1,9],19:[1,28],24:25,25:[1,10],27:11,31:12,32:13,33:14,34:[1,15],35:[1,20],36:[1,21],37:[1,19],47:[1,22],48:[1,16],50:18,53:23,55:[1,24],56:[1,26],57:[1,27],59:[1,29]},{15:68,20:84,32:70,33:69,35:[1,20],36:[1,21],38:85,44:67,47:[1,22]},{12:87,15:17,17:[2,53],26:86,47:[1,22]},{5:[2,13],8:[2,13],17:[2,13]},{5:[2,33],8:[2,33],17:[2,33],42:[1,88]},{5:[2,35],8:[2,35],17:[2,35],42:[2,35],43:[1,89]},{5:[2,37],8:[2,37],15:68,17:[2,37],21:[2,37],23:[2,37],32:70,33:69,35:[1,20],36:[1,21],38:90,42:[2,37],43:[2,37],44:67,47:[1,22]},{5:[2,39],8:[2,39],17:[2,39],19:[1,91],21:[2,39],23:[2,39],35:[2,39],36:[2,39],42:[2,39],43:[2,39],47:[2,39]},{5:[2,40],8:[2,40],17:[2,40],21:[2,40],23:[2,40],35:[2,40],36:[2,40],42:[2,40],43:[2,40],47:[2,40]},{5:[2,41],8:[2,41],17:[2,41],21:[2,41],23:[2,41],35:[2,41],36:[2,41],42:[2,41],43:[2,41],47:[2,41]},{5:[2,14],8:[2,14],17:[2,14]},{5:[2,60],8:[2,60],17:[2,60],21:[2,60],23:[2,60],49:[2,60],51:[2,60],52:[2,60],54:[2,60]},{5:[2,61],8:[2,61],17:[2,61],21:[2,61],23:[2,61],49:[2,61],51:[2,61],52:[2,61],54:[2,61]},{15:68,20:92,21:[1,94],23:[1,93],32:70,33:69,35:[1,20],36:[1,21],38:85,44:67,47:[1,22]},{15:68,20:95,21:[1,97],23:[1,96],32:70,33:69,35:[1,20],36:[1,21],38:85,44:67,47:[1,22]},{21:[1,98]},{21:[2,44],23:[1,99],49:[1,35],51:[1,36]},{9:50,11:77,19:[1,28],21:[2,45],23:[1,78],24:25,45:100,48:[1,16],50:18,53:23,55:[1,24],56:[1,26],57:[1,27],59:[1,29]},{5:[2,68],8:[2,68],17:[2,68],21:[2,68],23:[2,68],49:[2,68],51:[2,68],52:[2,68],54:[2,68]},{28:[2,30],30:[2,30]},{21:[2,49],23:[1,57],40:101,46:56,47:[1,58]},{21:[2,47]},{17:[1,102]},{21:[1,103],23:[1,104]},{21:[2,28],23:[2,28]},{17:[1,105]},{17:[2,52],23:[1,106]},{15:68,29:107,32:70,33:69,35:[1,20],36:[1,21],38:66,41:65,44:67,47:[1,22]},{24:108,59:[1,29]},{5:[2,36],8:[2,36],17:[2,36],21:[2,36],23:[2,36],42:[2,36],43:[2,36]},{9:50,11:77,19:[1,28],21:[2,45],23:[1,78],24:25,45:109,48:[1,16],50:18,53:23,55:[1,24],56:[1,26],57:[1,27],59:[1,29]},{21:[1,110],23:[1,111]},{9:50,11:112,19:[1,28],24:25,48:[1,16],50:18,53:23,55:[1,24],56:[1,26],57:[1,27],59:[1,29]},{5:[2,22],8:[2,22],17:[2,22],21:[2,22],23:[2,22],35:[2,22],36:[2,22],42:[2,22],43:[2,22],47:[2,22]},{21:[1,113],23:[1,114]},{9:50,11:115,19:[1,28],24:25,48:[1,16],50:18,53:23,55:[1,24],56:[1,26],57:[1,27],59:[1,29]},{5:[2,26],8:[2,26],17:[2,26],21:[2,26],23:[2,26],35:[2,26],36:[2,26],42:[2,26],43:[2,26],47:[2,26]},{5:[2,63],8:[2,63],17:[2,63],21:[2,63],23:[2,63],49:[2,63],51:[2,63],52:[2,63],54:[2,63]},{9:50,11:77,19:[1,28],21:[2,45],23:[1,78],24:25,45:116,48:[1,16],50:18,53:23,55:[1,24],56:[1,26],57:[1,27],59:[1,29]},{21:[2,43]},{21:[2,46]},{5:[2,9],8:[2,9],17:[2,9]},{22:[1,117]},{24:118,59:[1,29]},{5:[2,12],8:[2,12],17:[2,12]},{12:87,15:17,17:[2,53],26:119,47:[1,22]},{5:[2,32],8:[2,32],17:[2,32]},{5:[2,34],8:[2,34],17:[2,34],42:[2,34]},{21:[1,120]},{5:[2,19],8:[2,19],17:[2,19],21:[2,19],23:[2,19],35:[2,19],36:[2,19],42:[2,19],43:[2,19],47:[2,19]},{9:50,11:121,19:[1,28],24:25,48:[1,16],50:18,53:23,55:[1,24],56:[1,26],57:[1,27],59:[1,29]},{21:[1,122],49:[1,35],51:[1,36]},{5:[2,23],8:[2,23],17:[2,23],21:[2,23],23:[2,23],35:[2,23],36:[2,23],42:[2,23],43:[2,23],47:[2,23]},{9:50,11:123,19:[1,28],24:25,48:[1,16],50:18,53:23,55:[1,24],56:[1,26],57:[1,27],59:[1,29]},{21:[1,124],49:[1,35],51:[1,36]},{21:[2,42]},{15:125,47:[1,22]},{21:[1,126]},{17:[2,51]},{5:[2,38],8:[2,38],17:[2,38],21:[2,38],23:[2,38],35:[2,38],36:[2,38],42:[2,38],43:[2,38],47:[2,38]},{21:[1,127],49:[1,35],51:[1,36]},{5:[2,21],8:[2,21],17:[2,21],21:[2,21],23:[2,21],35:[2,21],36:[2,21],42:[2,21],43:[2,21],47:[2,21]},{21:[1,128],49:[1,35],51:[1,36]},{5:[2,25],8:[2,25],17:[2,25],21:[2,25],23:[2,25],35:[2,25],36:[2,25],42:[2,25],43:[2,25],47:[2,25]},{16:[1,129]},{22:[1,130]},{5:[2,20],8:[2,20],17:[2,20],21:[2,20],23:[2,20],35:[2,20],36:[2,20],42:[2,20],43:[2,20],47:[2,20]},{5:[2,24],8:[2,24],17:[2,24],21:[2,24],23:[2,24],35:[2,24],36:[2,24],42:[2,24],43:[2,24],47:[2,24]},{6:131,7:4,9:5,11:7,12:6,14:[1,8],15:17,17:[2,5],18:[1,9],19:[1,28],24:25,25:[1,10],27:11,31:12,32:13,33:14,34:[1,15],35:[1,20],36:[1,21],37:[1,19],47:[1,22],48:[1,16],50:18,53:23,55:[1,24],56:[1,26],57:[1,27],59:[1,29]},{15:132,47:[1,22]},{17:[1,133]},{16:[1,134]},{5:[2,10],8:[2,10],17:[2,10]},{6:135,7:4,9:5,11:7,12:6,14:[1,8],15:17,17:[2,5],18:[1,9],19:[1,28],24:25,25:[1,10],27:11,31:12,32:13,33:14,34:[1,15],35:[1,20],36:[1,21],37:[1,19],47:[1,22],48:[1,16],50:18,53:23,55:[1,24],56:[1,26],57:[1,27],59:[1,29]},{17:[1,136]},{5:[2,11],8:[2,11],17:[2,11]}],
defaultActions: {3:[2,2],30:[2,1],82:[2,47],100:[2,43],101:[2,46],116:[2,42],119:[2,51]},
parseError: function parseError(str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        throw new Error(str);
    }
},
parse: function parse(input) {
    var self = this, stack = [0], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    var args = lstack.slice.call(arguments, 1);
    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;
    this.yy.parser = this;
    if (typeof this.lexer.yylloc == 'undefined') {
        this.lexer.yylloc = {};
    }
    var yyloc = this.lexer.yylloc;
    lstack.push(yyloc);
    var ranges = this.lexer.options && this.lexer.options.ranges;
    if (typeof this.yy.parseError === 'function') {
        this.parseError = this.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    function lex() {
        var token;
        token = self.lexer.lex() || EOF;
        if (typeof token !== 'number') {
            token = self.symbols_[token] || token;
        }
        return token;
    }
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (this.lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + this.lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: this.lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: this.lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(this.lexer.yytext);
            lstack.push(this.lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.apply(yyval, [
                yytext,
                yyleng,
                yylineno,
                this.yy,
                action[1],
                vstack,
                lstack
            ].concat(args));
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};
/* generated by jison-lex 0.2.1 */
var lexer = (function(){
var lexer = {

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input) {
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len - 1);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function (match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex() {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState() {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules() {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState(n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState(condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {

var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:/* skip comment */
break;
case 1:/* skip whitespace */
break;
case 2:return 59
break;
case 3: /* 'text' */
									yy_.yytext = this.matches[1];
									return 58;
								
break;
case 4: /* "text" */
									yy_.yytext = this.matches[1];
									return 58;
								
break;
case 5:return 14
break;
case 6:return 18
break;
case 7:return 25
break;
case 8:return 22
break;
case 9:return 34
break;
case 10:return 36
break;
case 11:return 35
break;
case 12:return 37
break;
case 13:return 28
break;
case 14:return 30
break;
case 15:return 56
break;
case 16:return 57
break;
case 17:return 55
break;
case 18:return 48
break;
case 19:return 47
break;
case 20:return 52
break;
case 21:return 54
break;
case 22:return 51
break;
case 23:return 49
break;
case 24:return 19
break;
case 25:return 21
break;
case 26:return 16
break;
case 27:return 17
break;
case 28:return 23
break;
case 29:return 8
break;
case 30:return 43
break;
case 31:return 42
break;
case 32:return '.'
break;
case 33:return 10
break;
case 34:return 5
break;
}
},
rules: [/^(?:\/\/[^\n]*)/,/^(?:\s+)/,/^(?:[0-9]+(\.[0-9]+)?\b)/,/^(?:'(.*?)')/,/^(?:"(.*?)")/,/^(?:lscript\b)/,/^(?:lsystem\b)/,/^(?:alphabet\b)/,/^(?:using\b)/,/^(?:derive\b)/,/^(?:call\b)/,/^(?:sublsystem\b)/,/^(?:main\b)/,/^(?:-->)/,/^(?:-h>)/,/^(?:E\b)/,/^(?:PI\b)/,/^(?:__([A-Za-z_][A-Za-z_0-9_]*))/,/^(?:\$([A-Za-z_][A-Za-z_0-9_]*))/,/^(?:([A-Za-z_][A-Za-z_0-9_]*))/,/^(?:\*)/,/^(?:\/)/,/^(?:-)/,/^(?:\+)/,/^(?:\()/,/^(?:\))/,/^(?:\{)/,/^(?:\})/,/^(?:,)/,/^(?:;)/,/^(?::)/,/^(?:\|)/,/^(?:\.)/,/^(?:=)/,/^(?:$)/],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34],"inclusive":true}}
};
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();

// sublscript, environment.ctx.$a = XX


			
	l2js.compiler.ASTCompiler = (function()	{
		var LSystem = l2js.compiler.env.LSystem, 
			Alphabet = l2js.compiler.env.Alphabet, 
			LScript = l2js.compiler.env.LScript, 
			SubLScript = l2js.compiler.env.SubLScript, 
			SubLSystem = l2js.compiler.env.SubLSystem,
			lnodes = l2js.compiler.lnodes;
		
		function ASTCompiler(){
			// stack of states during compilation
			this.states = [];
			
			// list of names of a parameters if the compiler is in the RULE state
			this.ruleParams = [];
			// In rule state determines rule type
			this.ruleType = [];
			
			// id of lsystem in current context
			this.lsystems = [];
			
			// add functions
			this.funcs = [];
			
			
		}	
		
		ASTCompiler.funcsSrc = {
			"__color": "__color: function(r, g, b) {" +
					"var rgb = r;" + 
					"rgb = rgb << 8;" +
					"rgb |= g;" +
					"rgb = rgb << 8;" +
					"rgb |= b; return rgb/16581375;}"
		};
		
		ASTCompiler.states = {
			"GLOBAL": "global",
			"BLOCK": "block",
			"RULE": "rule"
		};
		
		ASTCompiler.prototype.makeRule = function(ancestor, successors, type) {

			// this.checkAlphabetSymbol(symbol.symbol);

			var hash = LSystem.makeHash({symbol: ancestor.symbol.id, params: this.ruleParams}, type);

			var i, src = "";
			for ( i = 0; i < successors.length; i++) {
				if (l2js.utils.isUndefined(successors[i].probability)) {
					successors[i].probability = 1;
				}
				
				// Add hash to current lsystem to add hash declaration to the lsystem prototype
				this.lsystems[0].rulesHash.push(hash);
				src +=  this.lsystems[0].id + ".prototype.rules['" + hash +"'].push(" + this.visitSuccessor(successors[i]) + ");";
			}
			return src;
		};

		ASTCompiler.prototype.makeRulesHashDecls = function(){
			var src = this.lsystems[0].id + ".prototype.rules = {};";

			// TODO: nedeklarovat ty samé
			for(var i = 0; i<this.lsystems[0].rulesHash.length; i++) {
				src += this.lsystems[0].id + ".prototype.rules['"+this.lsystems[0].rulesHash[i]+"'] =  [];\n";
			}
			return src;	
		}
		
		/**
		 * Generate code for root ASTBlock
		 */
		ASTCompiler.prototype.visitRoot = function(node) {
			if (node instanceof lnodes.ASTBlock && node.isRoot) {
				var src;

				src = "(function(l2js){\n";
				src += "var env = l2js.compiler.env,\n";
				src += "ctx = {};\n";
				
				var block = this.visitBlock(node);
				if(this.funcs && this.funcs.length) {
					src += this.addFuncs();
				}
				src += block;
				src += "\n})(l2js);\n";

				return src;
			} else {
				// TODO: Line numbers for compiling errors.
				throw Error("Root node in AST should be root ASTBLock.");
			}
		};
		
		ASTCompiler.prototype.addFuncs = function() {
			var funcsSrc = [];
			for(var i = 0; i<this.funcs.length; i++){
				ASTCompiler.funcsSrc[this.funcs[i]] && funcsSrc.push(ASTCompiler.funcsSrc[this.funcs[i]])
			}
			
			return "var funcs = {" +funcsSrc.join(",\n")+ "};\n";
		};
		
		/**
		 * Call generation of code for all nodes according to its type of
		 * AST object.
		 */
		ASTCompiler.prototype.visitNodes = function(nodes) {

			var src = "";

			var i;
			for (i = 0; i < nodes.length; i++) {
				if (nodes[i] instanceof lnodes.ASTBlock) {
					src += visitBlock(nodes[i]);
				} else if (nodes[i] instanceof lnodes.ASTId) {
					src += this.visitId(nodes[i]);
				} else if (nodes[i] instanceof lnodes.ASTAlphabet) {
					src += this.visitAlphabet(nodes[i]);
				} else if (nodes[i] instanceof lnodes.ASTLSystem) {
					src += this.visitLSystem(nodes[i]);
				} else if (nodes[i] instanceof lnodes.ASTLScript) {
					src += this.visitLScript(nodes[i]);
				} else if (nodes[i] instanceof lnodes.ASTRule) {
					src += this.visitRule(nodes[i]);
				} else if (nodes[i] instanceof lnodes.ASTCall) {
					src += this.visitCall(nodes[i]);
				} else if (nodes[i] instanceof lnodes.ASTDerive) {
					src += this.visitDerive(nodes[i]);
				} else {
					throw Error("Unexpected AST node ('"+nodes[i]+"').");
				}
			}

			return src;
		};

		ASTCompiler.prototype.visitBlock = function(block) {
			var src = "", declarations = [];
			
			// find declarations of variables, l-systems and alphabets
			var i;
			for (i = 0; i < block.entries.length; i++) {
				var entry = block.entries[i];
				if (entry instanceof lnodes.ASTLScript
						|| entry instanceof lnodes.ASTLSystem
						|| entry instanceof lnodes.ASTAlphabet) {
					declarations.push(entry.id.id);
				}
			}

			if (declarations.length) {
				src += "var " + declarations.join(", ") + ";\n";
			}

			this.states.unshift(block.isRoot?ASTCompiler.states.GLOBAL:ASTCompiler.states.BLOCK);
			
			src += this.visitNodes(block.entries);
			
			this.states.shift();
			
			return src;
		};
		
		ASTCompiler.prototype._makeId = function(id) {
			var prefix, newId;

			if(this.states[0] === ASTCompiler.states.RULE) {
				var cleanId = id.substring(1), // parameters are identified without '$' prefix
					isParam = l2js.utils.indexOf( this.ruleParams, cleanId)!==-1; 
				
				prefix = (isParam)? "":"this.ctx.";
				newId = (isParam)?cleanId:id;
				
			} else if (this.states[0] === ASTCompiler.states.GLOBAL) {
				newId = id;
				prefix = "ctx.";
			} else if (this.states[0] === ASTCompiler.states.BLOCK) {
				newId = id;
				prefix = "this.ctx.";
			} else {
				throw new Error("Unkonown state of the AST compiler.");
			}
			return  prefix + newId;
		}
		
		ASTCompiler.prototype.visitId = function(id) {
			// Variables only with expressions, declaration is made by visitBlock
			if(id.type === "var" && !l2js.utils.isUndefined(id.e)) {
				return this._makeId(id.id) + "=" + this.visitExpression(id.e) + ";\n";
			}
		};
		
		ASTCompiler.prototype.visitAlphabet = function(alphabet) {
			var id = alphabet.id.id, symbols = [];
			
			var i;
			for(i=0; i<alphabet.symbols.length; i++) {
				symbols.push("'" + alphabet.symbols[i].id + "'");
			}
			return id + " = new env.Alphabet('" + id + "', [" + symbols.join(",") + "]);\n";
		};
		
		ASTCompiler.prototype.visitLSystem = function(lsystem) {
			var src, id = lsystem.id.id;

			// definition of the L-system
			src = id + "= (function(_super, ctx) {\nl2js.utils.extend(" + id + ", _super);";
			
			// start constructor
			
			src += "function " + id + "() {\n" +
				id + ".__super__.constructor.apply(this, arguments);\n" +
				"this.self = " + id +";\n" +
				"this._init();";
			
			this.lsystems.unshift({id:id, rulesHash: []});
			
			// end of constructor and definition of static properties
			src += "}\n";
			
			// init function of declarations of context variables
			src += id + ".prototype._init = function() {\n";
			// separate variable declarations
			var i, entries = lsystem.body.entries, decs = [];
			for(i=entries.length - 1; i>=0; i--) {
				if(entries[i] instanceof lnodes.ASTId) {
					decs.unshift(entries.splice(i, 1)[0]);
				}
			}
			
			src += this.visitBlock({entries: decs});
			src += "};\n";
			// end of init
			
			// Static properties
			src += id + ".alphabet = " + lsystem.alphabet.id + ";\n" +
				id + ".id = '" + id + "';\n";
			
			// properties	
			var blockSrc = this.visitBlock(lsystem.body);
			
			src += this.makeRulesHashDecls();
			src += blockSrc;
			
			this.lsystems.shift();	
			
			
			src += id + ".prototype.axiom = function() {return " + this.visitString(lsystem.axiom, id) + ";};\n" ;
			
			
			if(!l2js.utils.isUndefined(lsystem.maxIterations)) {
				src += id + ".prototype.maxIterations = " + this.visitExpression(lsystem.maxIterations) + " ;\n";
			}
			
			
			// end of the L-system definition
			src += "return " + id + ";\n})(env.LSystem, this.ctx);\n";
			return src;
		};
		
		ASTCompiler.prototype.visitLScript = function(lscript) {
			var src ="", id = lscript.id.id;
			
			
			// find main call
			var i, mainCall;
			if(lscript.body) {
				for(i=0; i<lscript.body.entries.length; i++) {
					var entry = lscript.body.entries[i];
					if(entry instanceof lnodes.ASTCall && entry.isMain) {
						mainCall = entry;
					}
				}	
			}

			if(l2js.utils.isUndefined(mainCall)) {
				throw new Error("No main call within the script '" + id + "'.");
			}
			
			// definition
			src += id + "= (function(_super, ctx) {\nl2js.utils.extend(" + id + ", _super);";
			
			// start constructor
			src += "function " + id + "() {\n" +
				id + ".__super__.constructor.apply(this, arguments);\n" +  
				"this.self = " + id +";\n";
			
			
			
			src += this.visitBlock(lscript.body);
			
			
			// end of constructor and definition of static properties
			src += "}\n" +
				id + ".id = '" + id + "';\n";
			
			// end of definition
			src += "return " + id + ";\n})(env.LScript, ctx);\n";
			return src;
		};
		
		ASTCompiler.prototype.visitExpression = function(e) {
			if(e instanceof lnodes.ASTOperation) {
				return this.visitExpression(e.left) + e.op + this.visitExpression(e.right);
			} else if(e instanceof lnodes.ASTBrackets) {
				return "(" + this.visitExpression(e.e) + ")";
			} else if(e instanceof lnodes.ASTId) {
				return this._makeId(e.id);
			} else if(e instanceof lnodes.ASTFunc) {
				var exps = [];
				for(var i=0;i<e.args.length; i++) {
					exps.push(this.visitExpression(e.args[i]));
				}
				if(l2js.utils.indexOf(this.funcs, e.id) ===-1) {
					this.funcs.push(e.id);
				}
				return "funcs." + e.id + "(" + exps.join(",") + ")";
			} else if(typeof e === "number") {
				return e;
			}
			else {
				throw new Error("Unexpected expression symbol: " + e);
			}
		};
	
		
		ASTCompiler.prototype.visitString = function(str, lsystem) {
			var i, src="", modules = [];
			if(l2js.utils.isUndefined(str)) {
				return "undefined";
			}
			
			// foreach over modules
			for(i=0;i<str.length;i++) {
				var module = str[i];
				if(module instanceof lnodes.ASTModule) {
					modules.push( "["+this.visitModule(module, lsystem)+"]");
				} else if(module instanceof lnodes.ASTSubLSystem) {
					modules.push("["+this.visitSubLSystem(module)+"]");
				} else if(module instanceof lnodes.ASTCall) {
					modules.push(this.visitCall(module));
				} else {
					throw new Error("Expected '" + module + "' to be module, call or sublsystem.");
				}
			}
			var src = modules[0];
			modules.shift();
			return src + ".concat(" + modules.join(", ") + ")";
			
		};
		
		/** 
		 * Converts ASTModule to JS code.
		 * 
		 * @param {object} module - Input module
		 * @param  {array} params - list of parameters name for the determining of context of variables, see visitExpression method
		 * @param  {string} [lsystem] - If passed the alphabet for module is determined as alphabet from passed name, 
		 * 								otherwise alphabet of current L-system is used
		 * 
		 * @memberOf ASTCompiler 
		 */
		ASTCompiler.prototype.visitModule = function(module, lsystem){
			
			if(l2js.utils.isUndefined(module.symbol) || l2js.utils.isUndefined(module.symbol.id)) {
				throw new Error("Module symbol is undefined.");
			}
			
			var arr = module.args || module.params || [], 
				method = module.params?"getParamModule":"getModule",
				alphabetLystem = lsystem || this.lsystems[0].id;
			
			if(!alphabetLystem) {
				throw new Error("Unknown L-system for the symbol '" + module.symbol.id + "'. Cannot determine the right alphabet.")
			}
			
			var j, arrJs = [];
			for(j=0; j<arr.length; j++) {
				if(module.params) {
					arrJs.push("'" + arr[j].id + "'");
				} else {
					arrJs.push(this.visitExpression(arr[j]));
				}
			}
			
			return "env.LSystem." + method + "('" + module.symbol.id + "', [" + arrJs.join(", ") + "], " +
				alphabetLystem + ".alphabet" + ")";

		};
		
		ASTCompiler.prototype.visitSubLSystem = function(subLSystem){
			var lid = subLSystem.lsystem.id,
				args = ["this.ctx", lid];
			
			if(!l2js.utils.isUndefined(subLSystem.axiom)) {
				args.push(this.visitString(subLSystem.axiom, lid));
			}
			
			if(!l2js.utils.isUndefined(subLSystem.maxIterations)) {
				args.push(this.visitExpression(subLSystem.maxIterations));
			}
			 
			return "new env.SubLSystem(" + args.join(", ") + ").derive()";
		};
		
		ASTCompiler.prototype.visitCall = function(call){
			

			var lid = call.lsystem.id, src = "";
			
			// If main call then set derive parameters (axiom, lsystem, maxIterations) for the parent script
			if (call.isMain) {

				src += "this.main = "+ lid + ";\n";
				
				if(!l2js.utils.isUndefined(call.axiom)){
					this.states.unshift(ASTCompiler.states.GLOBAL);
					src += this.visitString(call.axiom, lid) + ";\n";
					this.states.shift();

				}
					
				if (!l2js.utils.isUndefined(call.maxIterations)) {
					src += "this.maxIterations = " + this.visitExpression(call.maxIterations) + " ;\n";
				}

			} else {
				var args = [];
				if(!l2js.utils.isUndefined(call.axiom)) {
					args.push(this.visitString(call.axiom, lid));
				}
				if(!l2js.utils.isUndefined(call.maxIterations)) {
					args.push(this.visitExpression(call.maxIterations)); 
				} 
				var srcDerivation = (this.ruleType === "h") ? "interpretation":"derivation";
				src = "new " + lid + "(" + (this.states[0] === ASTCompiler.states.GLOBAL?"ctx":"this.ctx")+ ").derive(" + args.join(", ") + ")."+srcDerivation+"\n";
			}
			return src;
		};
		
		ASTCompiler.prototype.visitDerive = function(derive) {
			return "return new " + derive.lscript.id + "(ctx).derive();";
		}
		
		ASTCompiler.prototype.visitSuccessor = function(successor) {
			
			return "{\nprobability : " + successor.probability + ",\n" +
					"successor : function("+ this.ruleParams.join(",")+") { \n" + 
					"return " + this.visitString(successor.string) + ";\n" +
					"}\n}\n";
		};
		
		ASTCompiler.prototype.visitRule = function(rule) {
			var src = "", params = [], ancestor = rule.ancestor, successors = rule.successors;
			
			if(ancestor.params) {
				var i;
				for(i=0; i<ancestor.params.length; i++) {
					// params don't have dolar sign
					params.push(ancestor.params[i].id);
				}
			}
			
			this.states.unshift(ASTCompiler.states.RULE);
			this.ruleParams = params;
			
			var prevRuleType = this.ruleType;
			
			this.ruleType = rule.type;
			
			src += this.makeRule(ancestor, successors, rule.type);
			
			this.ruleType = prevRuleType;
			
			this.ruleParams = [];
			
			this.states.shift();
			
			return src;
		};
		
		
		return ASTCompiler;
	})();

/**
 * Compiler compiles L2 code to JavaScript sequence of symbols generated as the
 * result derivation.
 * @class
 */




	function ParseError(msg, line) {
		this.msg = msg;
		this.line = line;
	}

	ParseError.prototype.toString = function() {
		return this.msg;
	};

	l2js.compiler.Compiler =  (function()	{
	
		function Compiler() {
			this.ASTCompiler = l2js.compiler.ASTCompiler;
		};
	
	
		/**
		 * Get code by file name
		 * @param {string} code
		 */
		Compiler.prototype.getFile = function(name) {
			if(!l2js.files[name]) {
				throw new Error("File ["+ name +"] does not exist.");
			}
			return l2js.files[name];
		};
		
		/**
		 * link external code to pragram 
		 * @param {string} code
		 */
		Compiler.prototype.linkCode = function(code) {
			var that = this, 
				replacer = function(match, file){
				return that.getFile(file);
			};
			
			return  code
					.replace(/include\s+\"([^\"]+)\";/, replacer)
					.replace(/include\s+\'([^\']+)\';/, replacer);
	
		};
	
		Compiler.prototype.compile = function(input) {
			var that = this, q = l2js.core.q, deferred = q.deferred(), code = input;
	
			setTimeout(function() {
				try {
					var ast, js;
	
					
					var linkedCode = that.linkCode(code);
					ast = that.toAST(linkedCode);
					
					console.log(ast);
	
					js = that.ASTToJS(ast);
					console.log(js);
					
					
								
					deferred.resolve(js);
				} catch (e) {
					deferred.reject(e);
				}
	
			}, 0);
	
			return deferred.promise;
		};
	
		Compiler.prototype.toAST = function(code) {
			return l2js.compiler.Lparser.parse(code);
		};
	
		Compiler.prototype.ASTToJS = function(ast) {
			var src; // generated js source of program
			
			src = new this.ASTCompiler().visitRoot(ast); 
	
	
			return src;
		};
		
		return Compiler;

	})();
	
	l2js.compiler.Lparser.yy = l2js.compiler.lnodes;
	l2js.compiler.Lparser.yy.ParseError = ParseError;

l2js.interpret = l2js.interpret || {};

/**
 * Interpret of the symbols of L-system. Used Builder design pattern. 
 *
 * @class
 */





	l2js.interpret.Turtle2DBuilder =  (function()	{
		function Turtle2DBuilder(options) {
			this.options = options;
		};
		
		Turtle2DBuilder.options = {
			container: "",
			width:100,
			height:100,
			skipUnknownSymbols: true,
			turtle: {
				initPosition: [0, 0],
				initOrientation: 0
			}
		};
		
		Turtle2DBuilder.turtleTransforms = {
			left: function(angle, turtle) {
				
			}, 
			right: function(angle, turtle) {
				
			},
			forward: function(step, turtle) {
				var pos = turtle.position;
				var orientation = turtle.orientation * Math.PI / 180;
				return [step*Math.cos(orientation)+pos[0], step*Math.sin(orientation)+pos[1]];
			}
			
		};
		
		Turtle2DBuilder.prototype.interpret = function(symbol, ctx) {
			if(!ctx.turtle2D) {
				this._init(ctx);
			}
			this._resolveSymbol(symbol, ctx);
			//console.log(symbol);
		};
	
		Turtle2DBuilder.prototype._resolveSymbol = function(symbol, ctx) {
			if(this._symbols[symbol.symbol]) {
				this._symbols[symbol.symbol].call(this, symbol, ctx);
			} else if(!this.options.skipUnknownSymbols){
				throw new Error('Unexpected symbol (\''+symbol.symbol+'\')');	
			}
		};
	
		Turtle2DBuilder.prototype._init = function(ctx){
			
			this.options = l2js.utils.extend(l2js.utils.copy(Turtle2DBuilder.options), this.options);
			if(!this.options.container) {
				throw new Error("Turtle2D should have set the container to draw on.");
			}
			
			var turtle2D = ctx.turtle2D = {},
				opts = this.options;
			turtle2D.stage  = new Kinetic.Stage({
			    container: opts.container,
				width: opts.width,
				height: opts.height
			});
			turtle2D.baseLayer = new Kinetic.Layer();
			turtle2D.stage.add(turtle2D.baseLayer);
			
			turtle2D.stack = [];
			turtle2D.turtle = {
				position: opts.turtle.initPosition, 
				orientation: opts.turtle.initOrientation
			};
		};	
		
		Turtle2DBuilder.prototype._normalizeStep = function(step) {
			return step * Math.max(this.options.width, this.options.height);
		};
		
		Turtle2DBuilder.prototype._normalizeAngle = function(angle) {
			var interval = angle % 360;
			return angle<0?360+interval:interval;
		};
		 
		Turtle2DBuilder.prototype._realColorToHexString= function(color) {
			return '#' + l2js.utils.padLeft( Math.round(16581375*color).toString(16), 0, 6);
		};

		Turtle2DBuilder.prototype._symbols = {
			/**
			 * 
			 * Forward and draw line
			 * F(step, stroke, color) 
			 * @param {Object} symbol
			 * @param {Object} ctx
			 */
			'F': function(symbol, ctx) {
				var step = this._normalizeStep(symbol.arguments[0]);
				var stroke = this._normalizeStep(symbol.arguments[1]);
				var color = this._realColorToHexString(symbol.arguments[2]);
				var turtle2D = ctx.turtle2D;
				var newPos = Turtle2DBuilder.turtleTransforms.forward(step, turtle2D.turtle);
				
				turtle2D.baseLayer.add( new Kinetic.Line({
			        points: [turtle2D.turtle.position[0], turtle2D.turtle.position[1], newPos[0], newPos[1]],
			        stroke: color,
			        strokeWidth: stroke,
			        lineCap: 'round',
			        lineJoin: 'round'
			    }));
     
				turtle2D.baseLayer.batchDraw();
				turtle2D.turtle.position = newPos;
			},
			/**
			 * 
			 * Move by step
			 * f(step) 
			 * @param {Object} symbol
			 * @param {Object} ctx
			 */
			'f': function(symbol, ctx) {
				var step = this._normalizeStep(symbol.arguments[0]);
				var turtle2D = ctx.turtle2D;
				var newPos = Turtle2DBuilder.turtleTransforms.forward(step, turtle2D.turtle);
				turtle2D.turtle.position = newPos;
			},
			/**
			 * Turn left
			 * 
			 * L(angle)
			 * 
			 * @param {Object} symbol
			 * @param {Object} ctx
			 */
			'L': function(symbol, ctx) {
				var turtle = ctx.turtle2D.turtle;
				var angle = symbol.arguments[0];
				angle && (turtle.orientation = this._normalizeAngle(turtle.orientation - angle));
				
			},
			'R': function(symbol, ctx) {
				var turtle = ctx.turtle2D.turtle;
				var angle = symbol.arguments[0];
				angle && (turtle.orientation = this._normalizeAngle(turtle.orientation + angle));
			},
			'SU': function(symbol, ctx) {
				var turtle2D = ctx.turtle2D;
				turtle2D.stack = turtle2D.stack || [];
				turtle2D.stack.unshift(l2js.utils.copy(turtle2D.turtle));
			},
			'SS': function(symbol, ctx) {
				var turtle2D = ctx.turtle2D;
				if(l2js.utils.isUndefined(turtle2D.stack)||!turtle2D.stack.length) {
					throw new Error('Cannot read from undefined of empty indices stack.');
				}
				turtle2D.turtle = turtle2D.stack.shift();
			},
			/**
			 * Start of polygon 
			 *
			 * PU(fillColor, stroke, strokeColor)
			 * 
			 * @param {Object} symbol
			 * @param {Object} ctx
			 */
			'PU': function(symbol, ctx) {
				var turtle2D = ctx.turtle2D, poly, fillColor, stroke, strokeColor;
				turtle2D.polyStack = turtle2D.polyStack || [];
				fillColor = this._realColorToHexString(symbol.arguments[0]);
				stroke = this._normalizeStep(symbol.arguments[1]);
				strokeColor = this._realColorToHexString(symbol.arguments[2]);
				
				poly = new Kinetic.Line({
			        points: [],
			        fill: fillColor,
			        stroke: stroke,
			        strokeWidth: strokeColor,
			        closed: true
			    });
				
				turtle2D.baseLayer.add(poly);
				turtle2D.polyStack.unshift(poly);
			},
			/**
			 * End of Polygon 
			 * @param {Object} symbol
			 * @param {Object} ctx
			 */
			'PS': function(symbol, ctx) {
				var turtle2D = ctx.turtle2D;
				if(l2js.utils.isUndefined(turtle2D.polyStack)||!turtle2D.polyStack.length) {
					throw new Error('Cannot read from undefined of empty polygon stack.');
				}
				turtle2D.polyStack.shift();
			},
			/**
			 * Add vertex to polygon 
			 * @param {Object} symbol
			 * @param {Object} ctx
			 */
			'V': function(symbol, ctx) {
				var turtle2D = ctx.turtle2D, turtle = turtle2D.turtle;
				if(l2js.utils.isUndefined(turtle2D.polyStack)||!turtle2D.polyStack.length) {
					throw new Error('Cannot read from undefined of empty polygon stack.');
				}
				var poly = turtle2D.polyStack[0];
				poly.points(poly.points().concat(turtle.position));
				turtle2D.baseLayer.batchDraw();
			}
			
			
		};
		
		return Turtle2DBuilder;

	})();

/**
 * Interpret of the symbols of L-system. Used Builder design pattern. 
 *
 * @class
 */





	l2js.interpret.Interpret =  (function(l2js)	{
	
		Interpret.options = {
			callbacks: {
				// end of interpretation
				end: function(){ 
					
				},
				// start reading symbols generated in next sublsystem
				newLSystem: function(lsys) {
					
				},
				// end reading symbols in sublsystem
				endOfLSystem: function(lsys) {
					
				}
			}	
		};
		
		function Interpret(result, options) {
			this.result = this._clearOutEmptyLSystems(l2js.utils.copy(result));
			this.options = options && l2js.utils.extend(l2js.utils.copy(Interpret.options), options) || Interpret.options;
			this.ctx = {};
		};
	
		/**
		 * Factory method for builder
		 * @param {object} symbol Symbol that shoud be interpreted by the right builder
		 * @return Implementation of Builder according Alphabet including 'symbol' 
		 */
		Interpret.prototype.getBuilder = function(symbol) {
			switch(symbol.alphabet.id) {
				case "Turtle2D":
					this._turtle2dBuilder || (this._turtle2dBuilder = new l2js.interpret.Turtle2DBuilder(this.options), this.ctx);
					return this._turtle2dBuilder;	
			}
			throw new Error("Unsupported alphabet: '" + symbol.alphabet.id + "'");
		};
	
		/**
		 * Interpret next symbol
		 */
		Interpret.prototype.next = function() {
			var symbol = this.getNextSymbol();
			if(symbol) {
				this.getBuilder(symbol).interpret(symbol, this.ctx);
			}
			return symbol;
		};
	
		/**
		 * Interpret all the symbols
		 */	
		Interpret.prototype.all = function() {
			while(this.hasNextSymbol()) {
				this.next();
			}
		};


		Interpret.prototype.hasNextSymbol = function() {
			if(!this._lSysBuf) {
				return !!(this.result && this.result.interpretation.length);
			}

			var bufLevel = 0;
			while(this._lSysBuf[bufLevel] && 
					l2js.utils.isUndefined(this._lSysBuf[bufLevel].interpretation[this._indexBuf[bufLevel]+1]) 
				) {
				bufLevel++;
			};
			return !!this._lSysBuf[bufLevel];
		};

		Interpret.prototype.getNextSymbol = function() {
			this._setupBuffers();
			
			var symbol, readIndex, result;
			
			readIndex = this._indexBuf.length === 0 ? 0: ++this._indexBuf[0];
			result = this._lSysBuf.length === 0 ? this.result : this._lSysBuf[0];
			
			// Set position of previous symbol if we are at the end of l-system buffer (if exists)
			// Also skip empty sublsystems
			while(result && l2js.utils.isUndefined(result.interpretation[readIndex]) ) {
				this._lSysBuf.shift();
				this._indexBuf.shift();
				this._trigger('endOfLSystem', result);
				
				result = this._lSysBuf[0];
				readIndex = ++this._indexBuf[0];
			}
			
			// Next symbol does not exists
			if(!result) {
				this._trigger('end');
				this._clearBuffers();
				return;	
			}
			
			symbol = result.interpretation[readIndex];	
			this._indexBuf[0] = readIndex;
			this._lSysBuf[0] = result;
				
			if(symbol instanceof l2js.compiler.env.SubLSystem) {
				this._trigger('newLSystem', symbol);
				this._indexBuf.unshift(0);
				this._lSysBuf.unshift(symbol);	
				symbol = symbol.interpretation[0];
			}
			
			return symbol; 					
		};
		
		Interpret.prototype._trigger = function(event) {
			var args = Array.prototype.slice.call(arguments, 1);
			this.options.callbacks[event] && this.options.callbacks[event].apply(args);
		};
		
		Interpret.prototype._setupBuffers = function() {
			// Buffer of symbol of the result of currently read l-system
			this._lSysBuf = this._lSysBuf || [];
			
			// Buffer of curent position in the lSysBuf
			this._indexBuf =  this._indexBuf || [];
		};
		
		Interpret.prototype._clearBuffers = function() {
			this._lSysBuf = null;
			this._indexBuf = null;
		};
		
		Interpret.prototype._clearOutEmptyLSystems = function(result) {
			if(result.interpretation) {
				var dels = [];
				for(var i=0; i<result.interpretation.length; i++){
					if(result.interpretation[i] instanceof l2js.compiler.env.SubLSystem) {
						result.interpretation[i] = this._clearOutEmptyLSystems(result.interpretation[i]);
						if(!result.interpretation[i].interpretation || result.interpretation[i].interpretation.length === 0) {
							dels.push(i);
						} 			
					}
				}
				for(var i = dels.length-1; i>=0; i--) {
					result.interpretation.splice(dels[i], 1);	
				}
			}
			return result;
			
		};
		
		
		return Interpret;
	})(l2js);

l2js.compile = function(code) {
		return new l2js.compiler.Compiler().compile(code);
	}
	
	l2js.derive = function(lsystemCode) {
		var out = eval(lsystemCode);		
		return out;
	}
	
	l2js.interpretAll = function(symbols, options) {
		return new l2js.interpret.Interpret(symbols, options).all();
	}



}));