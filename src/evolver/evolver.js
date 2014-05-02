'use strict';

window.l2js && window.l2js.utils && window.l2js.evolver && window.l2js.compiler && function(l2js) {

	/**
	 * Apply methods of Genetic programming to modify AST of the L2 program.
	 * Evaluation of individuals should be done by user himself.
	 */
	l2js.evolver.Evolver = (function(l2js) {
		var lnodes = l2js.compiler.lnodes, utils = l2js.utils;

		Evolver.options = {
			numberOfIndividuals : 10,
			lscript : "", // name of root lscript, if none is passed the first one is picked
			lsystems : [], // L-systems names to evolve within individual, default is main call
			lsystemsDeps : {}, // key - name of lsystem, value - array of ids of lsystem dependecies
			opProbabilities : {
				expressionsVariationMutation : 0.1,
				expressionsCreationMutation : 0.1,
				rulesCrossover : 0.1,
				rulesCrossoverAsNewRule : 0.1,
				rulesSymbolEpressionMutation : 0.1,
				rulesStringMutation : 0.1,
				rulesMutationAsNewRule : 0.1,
				stringsPermutation : 0.1
			},
			colorMutation : {
				h : [60, 180, 30, 0], // degrees
				hVariation : 10, // percents
				sVariation : 20,
				vVariation : 20,
				rVariation : 20,
				gVariation : 20,
				bVariation : 20,
				aVariation : 20
			},
			numberMutation : {// in percent
				variation : 20
			},
			selection : {
				elitism : 0 //  number of the best individuals to carry over to the next generation
			},
			newRuleProbabilityFactor : 2,
			evolveLScriptExpressions : true,
			maxLevelForRandomExpressions : 3,
			stringMutation : {
				blackList : ["PU", "PS"]
			}
		};

		/**
		 * @param population Initial population of l2 ASTs:
		 * {
		 * 	evaluation: ...,
		 *  ast: ...
		 *
		 * }
		 *
		 * @param options See Evolver.options
		 */
		function Evolver(population, options) {
			this.ASTUtils = new l2js.compiler.ASTUtils();
			this.RuleUtils = new l2js.evolver.RuleUtils();
			this.EUtils = new l2js.evolver.EUtils();
			this.options = options && l2js.utils.extend(l2js.utils.copy(Evolver.options), options) || Evolver.options;

			this.population = this._initPopulation(population);
		}


		Evolver.prototype.setOptions = function(options) {
			this.options = options && l2js.utils.extend(l2js.utils.copy(Evolver.options), options) || Evolver.options;
		};

		/**
		 * Apply selection and breeding until the population of new generation reach the maximum size.
		 * Before you call the method individuals of current generation should be evaluated.
		 */
		Evolver.prototype.nextGeneration = function() {

			this._sortByEvaluation(this.population);
			var nextGeneration = [];

			if (this.options.selection.elitism) {
				var elitism = this.options.selection.elitism;
				elitism > this.population.length && ( elitism = this.population.length);
				nextGeneration = utils.copy(this.population.slice(-elitism));
			}

			while (nextGeneration.length < this.options.numberOfIndividuals) {

				nextGeneration = nextGeneration.concat(this.breed());

			}
			// in case of odd number of needed individuals
			if (nextGeneration.length > this.options.numberOfIndividuals) {
				nextGeneration.pop();
			}

			this.population = nextGeneration;
		};

		Evolver.prototype.breed = function() {
			var offspring = utils.copy(this.select(2));
			this._initIndividual(offspring[0]);
			this._initIndividual(offspring[1]);
			offspring[0].evaluation = 0;
			offspring[1].evaluation = 0;

			this.rulesCrossover(offspring[0], offspring[1]);
			this.rulesMutation(offspring);
			this.stringPermutation(offspring);
			this.expressionMutation(offspring);

			return offspring;
		};

		/**
		 * Linear rank selection
		 *
		 * @param howMany How many individuals algorithm will select
		 */
		Evolver.prototype.select = function(howMany) {

			var threshold, individuals = [], dn = this.population.length * (this.population.length + 1);

			for (var i = 0; i < howMany; i++) {

				threshold = Math.random();
				var j = 1, p = 0, individual;
				while (!individual) {
					p += 2 * j / dn;
					if (p >= threshold) {
						individual = this.population[j - 1];
					}
					j++;
				}
				individuals.push(individual);
			}
			return individuals;
		};

		/**
		 * Returns population of current population
		 */
		Evolver.prototype.getPopulation = function() {
			return this.population;
		};

		Evolver.prototype.rulesCrossover = function(a, b) {
			for (var i = 0; i < a.lsystems.length; i++) {
				if (this._decide(this.options.opProbabilities.rulesCrossover)) {

					var ruleA, ruleB, successorA, successorB, lsysB;

					ruleA = this._getRandomRule(a.lsystems[i]);
					if (ruleA) {
						var j = 0;
						while (j < b.lsystems.length || !lsysB) {
							if (b.lsystems[j].id.id === a.lsystems[i].id.id) {
								lsysB = b.lsystems[j];
							}
							j++;
						}
						if (lsysB) {

							ruleB = this._getRandomMatchingRule(lsysB, ruleA);
							if (ruleB) {
								successorA = this._getRandomFromArray(ruleA.successors);
								successorB = this._getRandomFromArray(ruleB.successors);

								// result crossover probably  cause duplication
								if (successorA.string.length <= 1 && successorB.string.length <= 1) {
									return;
								}

								var crossA, crossB;
								if (this._decide(this.options.opProbabilities.rulesCrossoverAsNewRule)) {
									crossA = utils.copy(successorA);
									crossB = utils.copy(successorB);
									ruleA.successors.push(crossA);
									ruleB.successors.push(crossB);
								} else {
									crossA = successorA;
									crossB = successorB;
								}

								this._crossStrings(crossA, crossB);

							}
						}
					}
				}
			}

		};

		/**
		 * Swap randomly choosen parts from the rule
		 *
		 * @param a Array of ASTModules
		 * @param b Array of ASTModules
		 */
		Evolver.prototype._crossStrings = function(a, b) {

			// get all strings and substrings
			var stringsA = this.RuleUtils.findAll(function(node) {
				return node instanceof Array;
			}, a.string);
			var stringsB = this.RuleUtils.findAll(function(node) {
				return node instanceof Array;
			}, b.string);

			// TODO: refactor
			if (stringsA && stringsB) {
				var stringA = this._getRandomFromArray(stringsA);
				var stringB = this._getRandomFromArray(stringsB);

				// 0 ; n-1
				var start = this._getRandomInt(stringA.length - 1);
				//1 ; n-1 - start
				var end = 1 + this._getRandomInt(stringA.length - start - 1);

				var substringA = stringA.splice(start, end);

				var startB = this._getRandomInt(stringB.length - 1);
				var endB = 1 + this._getRandomInt(stringB.length - startB - 1);

				var substringB = stringB.splice(startB, endB);

				[].splice.apply(stringA, [startB, 0].concat(substringB));
				[].splice.apply(stringB, [start, 0].concat(substringA));
			}

		};

		Evolver.prototype._getRandomRule = function(lsys) {
			var rules = this.ASTUtils.findAll(function(node) {
				return node instanceof lnodes.ASTRule;
			}, lsys.body);
			return rules && this._getRandomFromArray(rules);
		};

		/**
		 * Finds random rule from 'lsys' according to 'rule'. Respects rule type and successor
		 */
		Evolver.prototype._getRandomMatchingRule = function(lsys, rule) {

			var LSystem = l2js.compiler.env.LSystem;
			var rules = this.ASTUtils.findAll(function(node) {
				return node instanceof lnodes.ASTRule && LSystem.makeHash(rule.ancestor, rule.type) === LSystem.makeHash(node.ancestor, node.type);
			}, lsys.body);

			return rules && this._getRandomFromArray(rules);

		};

		Evolver.prototype.rulesMutation = function(individuals) {
			for (var i = 0; i < individuals.length; i++) {
				var individual = individuals[i];
				for (var j = 0; j < individual.lsystems.length; j++) {

					if (this._decide(this.options.opProbabilities.rulesSymbolEpressionMutation)) {
						var rule = this._getRandomRule(individual.lsystems[j]);
						this.mutateSymbolsArgsInRule(rule);
					}

					if (this._decide(this.options.opProbabilities.rulesStringMutation)) {
						var rule = this._getRandomRule(individual.lsystems[j]);
						this.mutateStringInRule(individual.lsystems[j], rule);
					}
				}
			}

		};

		Evolver.prototype._getSuccessorForMutation = function(rule) {
			var succ = this._getRandomFromArray(rule.successors);
			var mutSucc;
			if (this._decide(this.options.opProbabilities.rulesMutationAsNewRule)) {
				mutSucc = utils.copy(succ);
				rule.successors.push(mutSucc);
				mutSucc.probability = mutSucc.probability ? mutSucc.probability / this.options.newRuleProbabilityFactor : 0.5;

			} else {
				mutSucc = succ;
			}
			return mutSucc;
		};

		Evolver.prototype.mutateSymbolsArgsInRule = function(rule) {

			var mutSucc = this._getSuccessorForMutation(rule);
			this.mutateSymbolsArgsInString(mutSucc.string, rule.ancestor.params);
		};

		Evolver.prototype.mutateSymbolsArgsInString = function(string, params) {

			var parametricMods = this.RuleUtils.findAll(function(node) {
				return ( node instanceof lnodes.ASTModule && node.args && node.args.length) || ( node instanceof lnodes.ASTSubLSystem && node.axiom && node.axiom.length);
			}, string);

			for (var i = 0; i < parametricMods.length; i++) {
				var mod = parametricMods[i];

				if ( mod instanceof lnodes.ASTModule) {
					for (var j = 0; j < mod.args.length; j++) {
						var terms = params && this._getArgsFromParams(params) || [];
						var arg = mod.args[j];
						terms.push(arg);
						mod.args[j] = this.mutateExpression(mod.args[j], terms);
					}
				} else if ( mod instanceof lnodes.ASTSubLSystem) {
					var terms = params && this._getArgsFromParams(params) || [];
					this.mutateSymbolsArgsInString(mod.axiom, terms);
				}

			}
		};

		/**
		 * Terminals for new substring is determined by successors of 'lsys' rules (not interpretation rules)
		 * and from symbols from the 'rule' successors.
		 */
		Evolver.prototype.mutateStringInRule = function(lsys, rule) {

			var mutSucc = this._getSuccessorForMutation(rule);

			var terminals = [], blackList = this.options.stringMutation.blackList;

			if ("-" === rule.type || !rule.type) {
				var rules = this.ASTUtils.findAll(function(node) {
					return node instanceof lnodes.ASTRule && (("-" === node.type || !node.type) || (rule.type === "h" && "h" === node.type) );
				}, lsys.body);
				for (var i = 0; i < rules.length; i++) {
					utils.indexOf(blackList, rules[i].ancestor.symbol.id) === -1 && terminals.push(utils.copy(rules[i].ancestor));
				}
			}

			for (var i = 0; i < mutSucc.string.length; i++) {

				if (mutSucc.string[i] instanceof lnodes.ASTStack || (mutSucc.string[i] instanceof lnodes.ASTModule && utils.indexOf(blackList, mutSucc.string[i].symbol.id) === -1)) {
					continue;
				}
				terminals.push(utils.copy(mutSucc.string[i]));
			}

			var substring = this._createRandomString(terminals, 1 + this._getRandomInt(mutSucc.string.length), 3);
			[].splice.apply(mutSucc.string, [this._getRandomInt(mutSucc.string.length), 0].concat(substring));

		};

		Evolver.prototype._createRandomString = function(terminals, length, maxStackLevel) {
			var string = [];
			for (var i = 0; i < length; i++) {
				if (maxStackLevel > 1 && this._decide(0.1)) {
					var stackString = this._createRandomString(terminals, length, maxStackLevel - 1);
					var start = new lnodes.ASTModule(new lnodes.ASTId("[", "symbol"));
					var end = new lnodes.ASTModule(new lnodes.ASTId("]", "symbol"));
					string.push(new lnodes.ASTStack(start, end, stackString));
				} else {

					var parametricTerminal = this._getRandomFromArray(terminals);
					var args = [];
					if ( parametricTerminal instanceof lnodes.ASTAncestor) {
						var expTerms = this._getArgsFromParams(parametricTerminal.params);
						if (expTerms) {
							for (var j = 0; j < expTerms.length; j++) {
								var expr = this._createRandomExpression(expTerms, this._decide(0.5) ? 3 : 4);
								args.push(expr);
							}
						}
						string.push(new lnodes.ASTModule(parametricTerminal.symbol, args));
					} else if ( parametricTerminal instanceof lnodes.ASTModule) {
						if (parametricTerminal.args) {
							for (var j = 0; j < parametricTerminal.args.length; j++) {
								var expr = this.mutateExpression(parametricTerminal.args[j]);
								args.push(expr);
							}
						}
						string.push(new lnodes.ASTModule(parametricTerminal.symbol, args));
					} else if ( parametricTerminal instanceof lnodes.ASTSubLSystem) {
						var sublsys = utils.copy(parametricTerminal);
						sublsys.maxIterations = parametricTerminal.maxIterations;

						if (sublsys.axiom && sublsys.axiom.length) {
							this.mutateSymbolsArgsInString(sublsys.axiom);
						}

						string.push(sublsys);
					}

				}
			}

			return string;
		};

		Evolver.prototype._getArgsFromParams = function(params) {
			if (!params) {
				return [];
			}
			var args = utils.copy(params);
			for (var i = 0; i < args.length; i++) {
				args[i].id = "$" + args[i].id;
				args[i].type = "param";
			}
			return args;
		};

		Evolver.prototype.stringPermutation = function() {

		};

		Evolver.prototype.expressionMutation = function(individuals) {
			for (var i = 0; i < individuals.length; i++) {
				var individual = individuals[i];

				if (this.options.evolveLScriptExpressions && individual.expressions) {
					for (var j = 0; j < individual.expressions.length; j++) {
						individual.expressions[j].e = this.mutateExpression(individual.expressions[j].e);

					}
				}

				for (var j = 0; j < individual.lsystems.length; j++) {
					var result = this.ASTUtils.findAll(function(node) {
						return ( node instanceof lnodes.ASTId && node.e);
					}, individual.lsystems[j].body);

					for (var k = 0; k < result.length; k++) {
						result[k].e = this.mutateExpression(result[k].e);

					}

				}
			}
		};

		Evolver.prototype.mutateExpression = function(e, terminals) {
			var probs = this.options.opProbabilities;

			if (this._decide(probs.expressionsVariationMutation)) {
				this._variateInExpression(e, terminals);
			}

			if (this._decide(probs.expressionsCreationMutation)) {
				e = this._beCreativeInExpression(e, terminals);
			}
			return e;
		};

		/**
		 * Replace part of expression 'e' by new randomly generated expression.
		 */
		Evolver.prototype._beCreativeInExpression = function(e, terminals) {

			if (!terminals || !terminals.length) {
				return e;
			}

			//@formatter:off
			var nodes = this.EUtils.findAll(function(node) {
				return node instanceof lnodes.ASTOperation || 
				node instanceof lnodes.ASTRef ||
				node instanceof lnodes.ASTId || 
				node instanceof lnodes.ASTBrackets;
			}, e);
			// @formatter:on

			if (nodes.length) {
				var node = this._getRandomFromArray(nodes);

				var terms = terminals || [], that = this;

				var getExp = function() {
					return that._createRandomExpression(terms, that._getRandomInt(that.options.maxLevelForRandomExpressions) + 1);
				};
				if ( node instanceof lnodes.ASTId || node instanceof lnodes.ASTRef) {
					e = getExp();
				} else if ( node instanceof lnodes.ASTOperation) {
					this._decide(0.5) ? (node.left = getExp()) : (node.right = getExp());
				} else if ( node instanceof lnodes.ASTBrackets) {
					node.e = getExp();
				}

			}

			return e;
		};

		/**
		 * Creates random expression
		 */
		Evolver.prototype._createRandomExpression = function(terminals, level) {
			if (level > 1) {// functions
				if (this._decide(0.8)) {
					var left = this._createRandomExpression(terminals, level - 1);
					var right = this._createRandomExpression(terminals, level - 1);
					return new lnodes.ASTOperation(this._getRandomFromArray(["*", "/", "+", "-"]), left, right);
				} else {
					return new lnodes.ASTBrackets(this._createRandomExpression(terminals, level - 1));
				}
			} else {// terminals
				if (terminals && terminals.length) {
					return this._getRandomFromArray(terminals);
				} else {
					return new lnodes.ASTRef(Math.round10(Math.random()));
				}
			}

		};

		Evolver.prototype._variateInExpression = function(e, terminals) {
			//@formatter:off
			var nodes = this.EUtils.findAll(function(node) {
				return node instanceof lnodes.ASTId || 
				node instanceof lnodes.ASTRef || 
				node instanceof lnodes.ASTOperation || 
				node instanceof lnodes.ASTBrackets || 
				( node instanceof lnodes.ASTFunc && utils.indexOf(["__rgb", "__hsv", "__xC", "__XC"], node.id) !== -1);
			}, e);
			//@formatter:on

			var node = this._getRandomFromArray(nodes);

			if ( node instanceof lnodes.ASTOperation) {
				var functionsPool = ["*", "/", "+", "-"];
				var functionsPoolIndex = utils.indexOf(functionsPool, node.op);
				functionsPool.splice(functionsPoolIndex, 1);
				node.op = this._getRandomFromArray(functionsPool);

			} else if ( node instanceof lnodes.ASTBrackets) {
				this._variateInExpression(node.e);

			} else if ( node instanceof lnodes.ASTFunc && utils.indexOf(["__rgb", "__hsv"], node.id) !== -1) {
				this._mutateColor(node, terminals);
			} else if ( node instanceof lnodes.ASTFunc && utils.indexOf(["__xC", "__XC"], node.id) !== -1) {

				for (var i = 0; i < node.args.length; i++) {
					node.args[i] = this._variateInExpression(node.args[i], terminals);
				}

			} else if ( node instanceof lnodes.ASTRef) {
				node.val = node.val * this._getRandomVariation(this.options.numberMutation.variation);
			} else if ( node instanceof lnodes.ASTId && terminals) {
				node.id.id = this._getRandomFromArray(terminals);
			}
			return e;
		};

		Evolver.prototype._getRandomVariation = function(variation) {

			return Math.round10((2 * Math.random() - 1) * variation / 100 + 1, -3);
		};

		/**
		 * Change the color. Hue of HSV model is mutated by predefined transformations. For SV channels a variation is computed.
		 * The same behavior as for SV is executed for RGB channels.
		 * There is a random chance that expressions will be mutated as well after the variations are applied.
		 *
		 * @param {Object} color ASTFunc either __hsv or __rgb
		 */
		Evolver.prototype._mutateColor = function(color, terminals) { debugger
			var colorOpts = this.options.colorMutation, expressionMutationProb = this.options.opProbabilities.expressionsMutation;
			var inColor = utils.copy(color);
			var that = this;
			function vary(inArg, outArg, variation) {
				if ( outArg instanceof lnodes.ASTRef && outArg.val === 0) {
					outArg.val = that._getRandomVariation(variation);
				} else {
					outArg = new lnodes.ASTOperation("*", new lnodes.ASTRef(that._getRandomVariation(variation)), new lnodes.ASTBrackets(inArg));
					if (that._decide(expressionMutationProb)) {
						outArg = that.mutateExpression(outArg, terminals);
					}
				}
				return outArg;
			}

			if (color.id === "__hsv") {
				var angle = this._getRandomFromArray(colorOpts.h);
				angle = new lnodes.ASTRef(angle * this._getRandomVariation(colorOpts.hVariation));

				color.args[0] = new lnodes.ASTOperation(angle < 0 ? "-" : "+", new lnodes.ASTBrackets(inColor.args[0]), angle);
				if (this._decide(expressionMutationProb)) {
					color.args[0] = this.mutateExpression(color.args[0], terminals);
				}
				color.args[1] = vary(inColor.args[1], color.args[1], colorOpts.sVariation);
				color.args[2] = vary(inColor.args[2], color.args[2], colorOpts.vVariation);
			} else if (color.id === "__rgb") {
				color.args[0] = vary(inColor.args[0], color.args[0], colorOpts.rVariation);
				color.args[1] = vary(inColor.args[1], color.args[1], colorOpts.gVariation);
				color.args[2] = vary(inColor.args[2], color.args[2], colorOpts.bVariation);
			}

			color.args[3] = vary(inColor.args[3], color.args[3], colorOpts.aVariation);
		};

		Evolver.prototype._shrinkExpression = function(e) {

		};

		Evolver.prototype._initPopulation = function(population) {
			var inited = [];
			for (var i = 0; i < population.length; i++) {
				this._initIndividual(population[i]);
				inited.push(population[i]);
			}
			this._sortByEvaluation(inited);
			return inited;

		};

		Evolver.prototype._sortByEvaluation = function(population) {

			function compare(a, b) {
				if (a.evaluation < b.evaluation)
					return -1;
				if (a.evaluation > b.evaluation)
					return 1;
				return 0;
			}


			population.sort(compare);
		};

		Evolver.prototype._initIndividual = function(individual) {

			var ast = individual.ast, opts = this.options;

			var lscript = this.ASTUtils.findOne(function(node) {
				return ( node instanceof lnodes.ASTLScript) && (!opts.lscript || node.id.id === opts.lscript);
			}, ast, false);

			if (!lscript) {
				throw new Error("No L-script '" + opts.lscript + "' founded.");
			}

			if (opts.evolveLScriptExpressions) {
				individual.expressions = this.ASTUtils.findAll(function(node) {
					return ( node instanceof lnodes.ASTId && node.e);
				}, lscript.body, false);
			}

			individual.lscript = lscript;

			// Find main
			if (!opts.lsystems || !opts.lsystems.length) {
				var main = this.ASTUtils.findOne(function(node) {
					return ( node instanceof lnodes.ASTCall && node.isMain);
				}, individual.lscript.body, false);

				if (main) {
					opts.lsystems = [main.lsystem.id];
				}

			}

			if (opts.lsystems && opts.lsystems.length) {
				individual.lsystems = this.ASTUtils.findAll(function(node) {
					return ( node instanceof lnodes.ASTLSystem) && utils.indexOf(opts.lsystems, node.id.id) !== -1;
				}, individual.lscript.body, false);
			}
		};

		// TODO: refactor - move to utils
		Evolver.prototype._decide = function(prob) {
			return prob >= Math.random();
		};

		Evolver.prototype._getRandomFromArray = function(arr) {
			return arr[ this._getRandomInt(arr.length)];
		};

		Evolver.prototype._getRandomInt = function(max) {
			return Math.floor(Math.random() * max);
		};

		return Evolver;
	})(l2js);

}(window.l2js);
