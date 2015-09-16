'use strict';

/**
 * Interpret of the symbols of L-system. Used Builder design pattern.
 *
 * @class
 */

window.l2js && window.l2js.utils && window.l2js.interpret && function(l2js) {

    l2js.interpret.Turtle2DBuilderPixi = (function() {
        function Turtle2DBuilderPixi(options) {
            this.options = options;
            this.symbolsStack = [];
            this.ctx = {};
        };

        Turtle2DBuilderPixi.options = {
            container: "",
            width: 100,
            height: 100,
            skipUnknownSymbols: true,
            symbolsPerFrame: 10,
            bgColor: '#ffffff',
            turtle: {
                initPosition: [0, 0],
                initOrientation: 0
            }
        };

        Turtle2DBuilderPixi.turtleTransforms = {
            forward: function(step, turtle) {
                var pos = turtle.position;
                var orientation = turtle.orientation * Math.PI / 180;
                return [step * Math.cos(orientation) + pos[0], step * Math.sin(orientation) + pos[1]];
            }
        };

        Turtle2DBuilderPixi.prototype.interpret = function(symbol) {
            if (!this.ctx.turtle2DPixi) {
                this._init();
            }

            this.symbolsStack.push(symbol);
            this._startAnimation();
        };

        Turtle2DBuilderPixi.prototype._handleError = function(err) {
            this._stopAnimation();
            throw new Error(err);
        };

        Turtle2DBuilderPixi.prototype._resolveNextSymbol = function() {
            if (!this.symbolsStack.length) {
                this._stopAnimation();
                return;
            }
            var symbol = this.symbolsStack.shift();
            if (this._symbols[symbol.symbol]) {
                this._symbols[symbol.symbol].call(this, symbol);
            } else if (!this.options.skipUnknownSymbols) {
                this._handleError('Unexpected symbol (\'' + symbol.symbol + '\')');
            }
        };

        Turtle2DBuilderPixi.prototype._init = function() {

            this.options = l2js.utils.extend(l2js.utils.copy(Turtle2DBuilderPixi.options), this.options);
            if (!this.options.container) {
                this._handleError("Turtle2D should have set the container to draw on.");
            }

            var turtle2DPixi = this.ctx.turtle2DPixi = {},
                opts = this.options;

            turtle2DPixi.stage = new Kinetic.Stage({
                container: opts.container,
                width: opts.width,
                height: opts.height
            });
            turtle2DPixi.baseLayer = new Kinetic.Layer();

            var bg = new Kinetic.Rect({
                x: 0,
                y: 0,
                width: opts.width,
                height: opts.height,
                fill: opts.bgColor
            });
            turtle2DPixi.baseLayer.add(bg);

            turtle2DPixi.stage.add(turtle2DPixi.baseLayer);

            turtle2DPixi.stack = [];
            turtle2DPixi.turtle = {
                position: opts.turtle.initPosition,
                orientation: opts.turtle.initOrientation
            };
            this.symbolsStack = [];
            this._initAnimation();

        };

        Turtle2DBuilderPixi.prototype._initAnimation = function() {
            var that = this;
            this._stopAnimation();

            this.animation = new Kinetic.Animation(function(frame) {
                var howMany = frame.timeDiff > 1 ? frame.timeDiff * that.options.symbolsPerFrame : 1;
                var i = 0;
                while (howMany > i && that.symbolsStack.length) {
                    that._resolveNextSymbol();
                    i++;
                }!that.symbolsStack.length && that._stopAnimation();

            }, this.ctx.turtle2DPixi.baseLayer);
        };

        Turtle2DBuilderPixi.prototype._startAnimation = function() {
            this.animation && !this.animation.isRunning() && this.animation.start();
        };

        Turtle2DBuilderPixi.prototype._stopAnimation = function() {
            this.animation && this.animation.stop();
        };

        Turtle2DBuilderPixi.prototype._normalizeStep = function(step) {
            var rough = step > 1 ? 1 : step;

            return rough * Math.max(this.options.width, this.options.height);
        };

        Turtle2DBuilderPixi.prototype._normalizeAngle = function(angle) {
            return l2js.utils.normalizeAngle(angle);
        };

        Turtle2DBuilderPixi.prototype._colorToHexString = function(color) {
            return l2js.utils.colorToHexString(color);
        };

        Turtle2DBuilderPixi.prototype._symbols = {
            /**
             *
             * Forward and draw line
             * F(step, stroke, color)
             * @param {Object} symbol
             */
            'F': function(symbol) {
                var step = this._normalizeStep(symbol.arguments[0]);
                var stroke = this._normalizeStep(symbol.arguments[1]);
                var color = this._colorToHexString(symbol.arguments[2]);
                var turtle2DPixi = this.ctx.turtle2DPixi;
                var newPos = Turtle2DBuilderPixi.turtleTransforms.forward(step, turtle2DPixi.turtle);

                turtle2DPixi.baseLayer.add(new Kinetic.Line({
                    points: [turtle2DPixi.turtle.position[0], turtle2DPixi.turtle.position[1], newPos[0], newPos[1]],
                    stroke: color.hex,
                    strokeWidth: stroke,
                    lineCap: 'round',
                    lineJoin: 'round',
                    opacity: color.a
                }));

                turtle2DPixi.baseLayer.batchDraw();
                turtle2DPixi.turtle.position = newPos;
            },
            /**
             *
             * Move by step
             * f(step)
             * @param {Object} symbol
             */
            'f': function(symbol) {
                var step = this._normalizeStep(symbol.arguments[0]);
                var turtle2DPixi = this.ctx.turtle2DPixi;
                var newPos = Turtle2DBuilderPixi.turtleTransforms.forward(step, turtle2DPixi.turtle);
                turtle2DPixi.turtle.position = newPos;
            },
            /**
             * Turn left
             *
             * L(angle)
             *
             * @param {Object} symbol
             */
            'L': function(symbol) {
                var turtle = this.ctx.turtle2DPixi.turtle;
                var angle = symbol.arguments[0];
                angle && (turtle.orientation = this._normalizeAngle(turtle.orientation - angle));

            },
            'R': function(symbol) {
                var turtle = this.ctx.turtle2DPixi.turtle;
                var angle = symbol.arguments[0];
                angle && (turtle.orientation = this._normalizeAngle(turtle.orientation + angle));
            },
            '[': function(symbol) {
                var turtle2DPixi = this.ctx.turtle2DPixi;
                turtle2DPixi.stack = turtle2DPixi.stack || [];
                turtle2DPixi.stack.unshift(l2js.utils.copy(turtle2DPixi.turtle));
            },
            ']': function(symbol) {
                var turtle2DPixi = this.ctx.turtle2DPixi;
                if (l2js.utils.isUndefined(turtle2DPixi.stack) || !turtle2DPixi.stack.length) {
                    this._handleError('Cannot read from undefined of empty indices stack.');
                }
                turtle2DPixi.turtle = turtle2DPixi.stack.shift();
            },
            /**
             * Start of polygon
             *
             * PU(fillColor, stroke, strokeColor)
             *
             * @param {Object} symbol
             */
            'PU': function(symbol) {
                var turtle2DPixi = this.ctx.turtle2DPixi,
                    poly, fillColor, stroke, strokeColor;
                turtle2DPixi.polyStack = turtle2DPixi.polyStack || [];
                fillColor = this._colorToHexString(symbol.arguments[0]);
                stroke = this._normalizeStep(symbol.arguments[1]);
                strokeColor = symbol.arguments[2] && this._colorToHexString(symbol.arguments[2]);

                poly = new Kinetic.Line({
                    points: [],
                    fill: fillColor.hex,
                    stroke: stroke,
                    strokeWidth: strokeColor && strokeColor.hex,
                    closed: true,
                    opacity: fillColor.a
                });

                turtle2DPixi.baseLayer.add(poly);
                turtle2DPixi.polyStack.unshift(poly);
            },
            /**
             * End of Polygon
             * @param {Object} symbol
             */
            'PS': function(symbol) {
                var turtle2DPixi = this.ctx.turtle2DPixi;
                if (l2js.utils.isUndefined(turtle2DPixi.polyStack) || !turtle2DPixi.polyStack.length) {
                    //this._handleError('Cannot read from undefined of empty polygon stack.');
                    return;
                }
                turtle2DPixi.polyStack.shift();
            },
            /**
             * Add vertex to polygon
             * @param {Object} symbol
             */
            'V': function(symbol) {
                var turtle2DPixi = this.ctx.turtle2DPixi,
                    turtle = turtle2DPixi.turtle;
                if (l2js.utils.isUndefined(turtle2DPixi.polyStack) || !turtle2DPixi.polyStack.length) {
                    //this._handleError('Cannot read from undefined of empty polygon stack.');
                    return;
                }
                var poly = turtle2DPixi.polyStack[0];
                poly.points(poly.points().concat(turtle.position));
                turtle2DPixi.baseLayer.batchDraw();
            }
        };

        return Turtle2DBuilderPixi;

    })();

}(window.l2js);
