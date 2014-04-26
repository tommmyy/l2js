'use strict';

window.l2js && window.l2js.utils && window.l2js.interpret && window.l2js.evolver && function(l2js) {


	l2js.evolver.Evolver =  (function(l2js)	{
	
		Evolver.options = {
			numberOfIndividuals: 10,	
			opsProbabilities: {
				expressionsCrossover: 0.1,
				expressionsMutation: 0.1,
				stringsCrossover: 0.1,
				stringsMutation: 0.1,
				stringsPermutation: 0.1
			}
		};
		
		function Evolver(population) {
			this.population = population;
		}
		
		/**
		 * Apply mu 
		 */
		Evolver.prototype.nextGeneration = function() {
			
		};
		
		Evolver.prototype.breed = function() {
			individuals = this.select();
			
			this.stringCrosssver(individuals[0], individuals[1]);
			this.stringMutation(individuals);
			this.stringPermutation(individuals);
			this.expressionCrossover(individuals[0], individuals[1]);
			this.expressionMutation(individuals[0], individuals[1]);
		};
		
		Evolver.prototype.getPopulation = function() {
			return this.population;
		};
		
		Evolver.prototype.select = function() {
			
		};
		
		
		return Evolver;
	})(l2js);

}(window.l2js);