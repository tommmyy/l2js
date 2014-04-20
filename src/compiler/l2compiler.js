'use strict';

/**
 * Compiles AST of script to L2 language with proper formatting.
 */
window.l2js && window.l2js.utils && function(l2js) {
	var lnodes = l2js.compiler.lnodes;

	l2js.compiler.L2Compiler = (function() {

		function L2Compiler(ast) {
			this.ast = ast;
			this.level = 0;
		}

		/**
		 *  String for the one level of indentation
		 */
		L2Compiler.PREFIX = "   ";

		L2Compiler.prototype.compile = function() {
			if (this.ast instanceof lnodes.ASTBlock && this.ast.isRoot) {
				return this.visitBlock(this.ast);
			} else {
				throw new Error("AST must be root block");
			}

		};

		L2Compiler.prototype.visitNodes = function(nodes) {
			var src = "";
			for (var i = 0; i < nodes.length; i++) {
				src += this.visitNode(nodes[i]);
			}

			return src;
		};

		L2Compiler.prototype.visitNode = function(node) {
			var src = "";
			if ( node instanceof lnodes.ASTBlock) {
				src += this.visitBlock(node);
			} else if ( node instanceof lnodes.ASTId) {
				src += this.visitId(node);
			} else if ( node instanceof lnodes.ASTAlphabet) {
				src += this.visitAlphabet(node);
			} else if ( node instanceof lnodes.ASTLSystem) {
				src += this.visitLSystem(node);
			} else if ( node instanceof lnodes.ASTLScript) {
				src += this.visitLScript(node);
			} else if ( node instanceof lnodes.ASTRule) {
				src += this.visitRule(node);
			} else if ( node instanceof lnodes.ASTCall) {
				src += this.visitCall(node);
			} else if ( node instanceof lnodes.ASTDerive) {
				src += this.visitDerive(node);
			} else if (node instanceof lnodes.ASTIncluded) {
				src += this.visitIncluded(node);
			} else {
				throw new Error("Unexpected AST node ('" + node + "').");
			}
			return src;
		};

		L2Compiler.prototype.visitBlock = function(node) {
			return this._printLine("include '" + node.file + "'");
		};

		L2Compiler.prototype.visitBlock = function(node) {
			!node.isRoot && this.level++;
			var src = this.visitNodes(node.entries);
			!node.isRoot && this.level--;
			return src;
		};

		L2Compiler.prototype.visitLScript = function(node) {
			var src = this._printLine("lscript " + node.id.id + " {") + this.visitBlock(node.body);
			src += this._printLine("};\n");

			return src;
		};

		L2Compiler.prototype.visitAlphabet = function(node) {
			var src = this._printLine("alphabet " + node.id.id + " {"), symbols = [];

			for (var i = 0; i < node.symbols.length; i++) {
				symbols.push(node.symbols[i].id);
			}

			this.level++;
			src += this._printLine(symbols.join(", "));
			this.level--;

			src += this._printLine("};\n");

			return src;
		};

		L2Compiler.prototype.visitLSystem = function(node) {

			var argsArr = [], args;

			node.axiom && argsArr.push(this.visitString(node.axiom));
			!l2js.utils.isUndefined(node.maxIterations) && argsArr.push(this.visitExpression(node.maxIterations));
			if (argsArr.length) {
				args = "(" + argsArr.join(", ") + ")";
			}

			var src = this._printLine("lsystem " + node.id.id + args + " using " + node.alphabet.id + " {") + this.visitBlock(node.body);
			src += this._printLine("};\n");

			return src;
		};

		L2Compiler.prototype.visitString = function(str) {
			var i, src = "", modules = [];
			if (l2js.utils.isUndefined(str)) {
				return "";
			}

			// foreach over modules
			for ( i = 0; i < str.length; i++) {
				var module = str[i];
				if ( module instanceof lnodes.ASTModule) {
					modules.push(this.visitModule(module));
				} else if ( module instanceof lnodes.ASTSubLSystem) {
					modules.push(this.visitSubLSystem(module));
				} else if ( module instanceof lnodes.ASTCall) {
					modules.push(this.visitCall(module));
				} else {
					throw new Error("Expected '" + module + "' to be module, call or sublsystem.");
				}
			}

			return modules.join(" ");

		};

		L2Compiler.prototype.visitModule = function(module) {

			if (l2js.utils.isUndefined(module.symbol) || l2js.utils.isUndefined(module.symbol.id)) {
				throw new Error("Module symbol is undefined.");
			}

			var src, arr = module.args || module.params || [];

			var j, args = [];
			for ( j = 0; j < arr.length; j++) {
				if (module.params) {
					args.push(arr[j].id);
				} else {
					args.push(this.visitExpression(arr[j]));
				}
			}
			src = module.symbol.id;
			if (args.length) {
				src += "(" + args.join(", ") + ")";
			}
			return src;

		};

		L2Compiler.prototype.visitSubLSystem = function(node) {
			var lid = node.lsystem.id, args = [];

			args.push(l2js.utils.isUndefined(node.axiom) && this.visitString(node.axiom) || "");
			!l2js.utils.isUndefined(node.maxIterations) && args.push(this.visitExpression(node.maxIterations));

			return "sublsystem " + lid + "(" + args.join(", ") + ")";
		};

		L2Compiler.prototype.visitCall = function(node) {
			var lid = node.lsystem.id, src, args = [];

			args.push(l2js.utils.isUndefined(node.axiom) && this.visitString(node.axiom) || "");
			!l2js.utils.isUndefined(node.maxIterations) && args.push(this.visitExpression(node.maxIterations));

			src = "call " + lid + "(" + args.join(", ") + ")";

			if (node.isMain) {
				src = this._printLine("main " + src + ";");
			}
			return src;
		};

		L2Compiler.prototype.visitDerive = function(node) {
			return this._printLine("derive " + node.lscript.id + ";");
		};

		L2Compiler.prototype.visitSuccessor = function(successor) {
			var src = this.visitString(successor.string);
			if (!l2js.utils.isUndefined(successor.probability)) {
				src += " : " + successor.probability;
			}
			return src;
		};

		L2Compiler.prototype.visitAncestor = function(ancestor) {
			return this.visitModule(ancestor);
		};

		L2Compiler.prototype.visitRule = function(rule) {
			var src = "", params = [], ancestor = rule.ancestor, successors = [];

			var op = rule.type === "h" ? "-h>" : "-->";

			for (var i = 0; i < rule.successors.length; i++) {
				successors.push(this.visitSuccessor(rule.successors[i]));
			}

			src += this._printLine(this.visitAncestor(ancestor) + " " + op + " " + successors.join(" | ") + ";");

			return src;
		};

		L2Compiler.prototype.visitId = function(node) {
			var src = "";

			if (node.type === "var") {
				src = node.id;

				if (node.e) {
					src = this._printLine(src + " = " + this.visitExpression(node.e) + ";");
				}
			} else {
				src += node.id;
			}
			return src;
		};

		L2Compiler.prototype.visitExpression = function(e) {
			if ( e instanceof lnodes.ASTOperation) {
				return this.visitExpression(e.left) + " " + e.op + " " + this.visitExpression(e.right);
			} else if ( e instanceof lnodes.ASTBrackets) {
				return "(" + this.visitExpression(e.e) + ")";
			} else if ( e instanceof lnodes.ASTId) {
				return this.visitId(e);
			} else if ( e instanceof lnodes.ASTFunc) {
				var exps = [];
				for (var i = 0; i < e.args.length; i++) {
					exps.push(this.visitExpression(e.args[i]));
				}
				return e.id + "(" + exps.join(",") + ")";
			} else if ( typeof e === "number") {
				return e;
			} else {
				throw new Error("Unexpected expression symbol: " + e);
			}
		};

		L2Compiler.prototype.visitIncluded = function(node) {
			return this._printLine('include "'+ node.file +'";');
		};
		
		L2Compiler.prototype._printLine = function(text) {
			var level = this.level, prefix = "";
			while (level) {
				prefix += L2Compiler.PREFIX;
				level--;
			}
			return prefix + text + "\n";
		};

		return L2Compiler;
	})();
}(window.l2js);
