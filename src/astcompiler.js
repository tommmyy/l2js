'use strict';
// sublscript, environment.ctx.$a = XX

window.l2js && window.l2js.utils && function(l2js) {			
	l2js.ASTCompiler = (function()	{
		
		function ASTCompiler(){
			// stack of states during compilation
			this.states = [];
			
			// list of names of a parameters if the compiler is in the RULE state
			this.ruleParams = [];
		}	
		
		
		ASTCompiler.states = {
			"GLOBAL": "global",
			"BLOCK": "block",
			"RULE": "rule"
		};
		
		/**
		 * Generate code for root ASTBlock.
		 */
		ASTCompiler.prototype.visitRoot = function(node) {
			if (node instanceof l2js.lnodes.ASTBlock && node.isRoot) {
				var src;

				src = "(function(environment){\n";
				src += this.visitBlock(node);
				src += "})(l2js.environment);\n";

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

			var src = "", lnodes = l2js.lnodes;

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
				} else {

					// TODO: error unexpected AST node
					
				}
			}

			return src;
		};

		ASTCompiler.prototype.visitBlock = function(block) {
			var src = "", lnodes = l2js.lnodes, declarations = [];

			// Root block creates global scope
			//if (block.isRoot) {
				//declarations.push("ctx={}");
			//} 
			
			// find declarations of variables, l-systems and alphabets
			var i;
			for (i = 0; i < block.entries.length; i++) {
				var entry = block.entries[i];
				if (entry instanceof lnodes.ASTLSystem
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
				prefix = "environment.ctx.";
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
			return id + " = new l2js.Alphabet('" + id + "', [" + symbols.join(",") + "]);\n";
		};
		
		ASTCompiler.prototype.visitLSystem = function(lsystem) {
			var src, id = lsystem.id.id;

			// definition
			src = id + "= (function(_super) {\nl2js.utils.extend(" + id + ", _super);";
			
			// start constructor
			
			src += "function " + id + "() {\n" +
				id + ".__super__.constructor.apply(this, arguments);\n" +
				"this.self = " + id + ";\n" +
				"this.axiom = " + this.visitString(lsystem.axiom) + ";\n" ;
			
			if(lsystem.maxIterations) {
				src += "this.maxIterations = " + lsystem.maxIterations + " ;\n";
			}
			
			// body
			src += this.visitBlock(lsystem.body);
			
			// end of constructor and definition of static properties
			src += "}\n" +
				id + ".alphabet = " + lsystem.alphabet.id + ";\n" +
				id + ".id = '" + id + "';\n";
			
			// end of definition
			src += "return " + id + ";\n})(l2js.LSystem);\n";
			return src;
		};
		
		ASTCompiler.prototype.visitLScript = function(lscript) {
			var src ="", id = lscript.id.id;
			
			
			// find main call
			var i, mainCall;
			if(lscript.body) {
				for(i=0; i<lscript.body.entries.length; i++) {
					var entry = lscript.body.entries[i];
					if(entry instanceof l2js.lnodes.ASTCall && entry.isMain) {
						mainCall = entry;
					}
				}	
			}

			if(l2js.utils.isUndefined(mainCall)) {
				throw new Error("No main call within the script '" + id + "'.");
			}
			
			// definition
			src += id + "= (function(_super) {\nl2js.utils.extend(" + id + ", _super);";
			
			// start constructor
			src += "function " + id + "() {\n" +
				id + ".__super__.constructor.apply(this, arguments);\n";
			
			
			src += this.visitBlock(lscript.body);
			
			
			// end of constructor and definition of static properties
			src += "}\n" +
				id + ".id = '" + id + "';\n";
			
			// end of definition
			src += "return " + id + ";\n})(l2js.LScript);\n";
			return src;
		};
		
		ASTCompiler.prototype.visitExpression = function(e) {
			if(e instanceof l2js.lnodes.ASTOperation) {
				return this.visitExpression(e.left) + e.op + this.visitExpression(e.right);
			} else if(e instanceof l2js.lnodes.ASTBrackets) {
				return "(" + this.visitExpression(e.e) + ")";
			} else if(e instanceof l2js.lnodes.ASTId) {
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
				if(module instanceof l2js.lnodes.ASTModule) {
					modules.push( "["+this.visitModule(module, lsystem)+"]");
				} else if(module instanceof l2js.lnodes.ASTSubLSystem) {
					modules.push("["+this.visitSubLSystem(module)+"]");
					
				} else if(module instanceof l2js.lnodes.ASTCall) {
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
			if(l2js.utils.isUndefined(module.symbol)) {
				throw new Error("Module symbol is undefined.");
			}
			
			var arr = [], method = "getModule";
			if(module.args) {
				arr = module.args;
			} else if (module.params){
				arr = module.params;
				method = "getParamModule";
			} 
			
			var j, arrJs = [];
			for(j=0; j<arr.length; j++) {
				if(module.params) {
					arrJs.push("'" + arr[j].id + "'");
				} else {
					arrJs.push(this.visitExpression(arr[j]));
				}
				
			}
			
			return "this." + method + "('" + module.symbol.id + "', [" + arrJs.join(", ") + "], " +
				(lsystem ? lsystem : "this.self") + ".alphabet.id" + ")";

		};
		
		ASTCompiler.prototype.visitSubLSystem = function(subLSystem){
			var lid = subLSystem.lsystem.id;
			return "new SubLSystem(" + lid + ",  " + this.visitString(subLSystem.axiom, lid) + ", " + subLSystem.maxIterations + ").derive()\n";
		};
		
		ASTCompiler.prototype.visitCall = function(call){
			

			var lid = call.lsystem.id, src = "";
			
			// If main call then set derive parameters (axiom, lsystem, maxIterations) for the parent script
			if (call.isMain) {

				src += "this.main = "+ lid + ";\n"
						+ "this.axiom = " + this.visitString(call.axiom, lid) + ";\n";

				if (call.maxIterations) {
					src += "this.maxIterations = " + call.maxIterations + " ;\n";
				}

			} else {

				src += "new " + lid + "().derive("
						+ this.visitString(call.axiom, lid) + ", "
						+ call.maxIterations + ")";

			}
	
	
			return src;
		};
		
		ASTCompiler.prototype.visitSuccessor = function(successor) {
			
			return "{\nprobability : " + successor.probability + ",\n" +
					"successor : function("+ this.ruleParams.join(",")+") { \n" + 
					"return" + this.visitString(successor.string) + ";\n" +
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
			
			src += "this.addRule(" + this.visitModule(ancestor) + ", [\n";
			
			
			
			// list of successors	
			var successorsJs = [];
			for(i=0;i<successors.length;i++) {	
				successorsJs.push(this.visitSuccessor(successors[i]));
				
			}
				
			src += successorsJs.join(",") + "], '" + (rule.type?rule.type:'-') + "');\n";
			
			this.states.shift();
			
			return src;
		};
		
		
		return ASTCompiler;
	})();
}(window.l2js);	