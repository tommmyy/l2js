'use strict';
// sublscript, environment.ctx.$a = XX

window.l2js && window.l2js.utils && window.l2js.compiler.env && window.l2js.compiler.env.LSystem && window.l2js.compiler.env.Alphabet && window.l2js.compiler.env.LScript && window.l2js.compiler.env.SubLScript && window.l2js.compiler.env.SubLSystem && function(l2js) {			
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
		}	
		
		
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
				src += this.visitBlock(node);
				src += "\n})(l2js);\n";

				return src;
			} else {
				// TODO: Line numbers for compiling errors.
				throw Error("Root node in AST should be root ASTBLock.");
			}
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
		
		ASTCompiler.prototype.makeId = function(id) {
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
			if(id.type === "var" && id.e) {
				return this.makeId(id.id) + "=" + this.visitExpression(id.e) + ";\n";
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
				"this.self = " + id +";\n";
			
			this.lsystems.unshift({id:id, rulesHash: []});
			
			// constructor has only declarations of context variables
			// separate variable declarations
			var i, entries = lsystem.body.entries, decs = [];
			for(i=0; i<entries.length; i++) {
				if(entries[i] instanceof lnodes.ASTId) {
					decs = decs.concat(entries.splice(i, 1));
				}

			}
			
			src += this.visitBlock({entries: decs});
			
			// end of constructor and definition of static properties
			src += "}\n";

			// Static properties
			src += id + ".alphabet = " + lsystem.alphabet.id + ";\n" +
				id + ".id = '" + id + "';\n";
			
			// properties	
			var blockSrc = this.visitBlock(lsystem.body);
			
			src += this.makeRulesHashDecls();
			src += blockSrc;
			
			this.lsystems.shift();	
			
			this.states.unshift(ASTCompiler.states.GLOBAL);
			
			src += id + ".prototype.axiom = " + this.visitString(lsystem.axiom, id) + ";\n" ;
			
			this.states.shift();			
			
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
				return this.makeId(e.id);
			} else if(typeof e === "number") {
				return e;
			} else {
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
					src += "this.axiom = " + this.visitString(call.axiom, lid) + ";\n";

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
				src = "new " + lid + "(this.ctx).derive(" + args.join(", ") + ")."+srcDerivation+"\n";
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
			this.ruleType = rule.type;
			
			src += this.makeRule(ancestor, successors, rule.type);
			
			this.ruleParams = [];
			
			this.states.shift();
			
			return src;
		};
		
		
		return ASTCompiler;
	})();
}(window.l2js);	