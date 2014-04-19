'use strict';

/**
 * Interpret of the symbols of L-system. Used Builder design pattern. 
 *
 * @class
 */

window.l2js && window.l2js.utils && window.l2js.interpret && function(l2js) {


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

}(window.l2js);