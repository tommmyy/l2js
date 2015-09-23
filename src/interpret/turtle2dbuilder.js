'use strict';

/**
 * Interpret of the symbols of L-system. Used Builder design pattern.
 *
 * @class
 */

window.l2js && window.l2js.utils && window.l2js.interpret && function(l2js) {

    l2js.interpret.Turtle2DBuilder = (function() {
        function Turtle2DBuilder(options) {
            this.options = options;
            this.symbolsStack = [];
            this.ctx = {};
        };

        Turtle2DBuilder.options = {
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

        Turtle2DBuilder.turtleTransforms = {
            left: function(angle, turtle) {

            },
            right: function(angle, turtle) {

            },
            forward: function(step, turtle) {
                var pos = turtle.position;
                var orientation = turtle.orientation * Math.PI / 180;
                return [step * Math.cos(orientation) + pos[0], step * Math.sin(orientation) + pos[1]];
            }
        };

        Turtle2DBuilder.prototype.interpret = function(symbol) {
            if (!this.ctx.turtle2D) {
                this._init();
            }

            this.symbolsStack.push(symbol);
            this._startAnimation();
        };

        Turtle2DBuilder.prototype._handleError = function(err) {
            this._stopAnimation();
            throw new Error(err);
        };

        Turtle2DBuilder.prototype._resolveNextSymbol = function() {
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

        Turtle2DBuilder.prototype._init = function() {

            this.options = l2js.utils.extend(l2js.utils.copy(Turtle2DBuilder.options), this.options);
            if (!this.options.container) {
                this._handleError("Turtle2D should have set the container to draw on.");
            }

            var turtle2D = this.ctx.turtle2D = {},
                opts = this.options;
            turtle2D.stage = new Kinetic.Stage({
                container: opts.container,
                width: opts.width,
                height: opts.height
            });
            turtle2D.baseLayer = new Kinetic.Layer();

            var bg = new Kinetic.Rect({
                x: 0,
                y: 0,
                width: opts.width,
                height: opts.height,
                fill: opts.bgColor
            });
            turtle2D.baseLayer.add(bg);

            turtle2D.stage.add(turtle2D.baseLayer);

            turtle2D.stack = [];
            turtle2D.turtle = {
                position: opts.turtle.initPosition,
                orientation: opts.turtle.initOrientation
            };
            this.symbolsStack = [];
            this._initAnimation();

        };

        Turtle2DBuilder.prototype._initAnimation = function() {
            var that = this;
            this._stopAnimation();
            this.animation = new Kinetic.Animation(function(frame) {
                var howMany = frame.timeDiff > 1 ? frame.timeDiff * that.options.symbolsPerFrame : 1;
                var i = 0;
                while (howMany > i && that.symbolsStack.length) {
                    that._resolveNextSymbol();
                    i++;
                }

                !that.symbolsStack.length && that._stopAnimation();

            }, this.ctx.turtle2D.baseLayer);
        };

        Turtle2DBuilder.prototype._startAnimation = function() {
            this.animation && !this.animation.isRunning() && this.animation.start();
        };

        Turtle2DBuilder.prototype._stopAnimation = function() {
            this.animation && this.animation.stop();
        };

        Turtle2DBuilder.prototype._normalizeStep = function(step) {
            var rough = step > 1 ? 1 : step;

            return rough * Math.max(this.options.width, this.options.height);
        };

        Turtle2DBuilder.prototype._normalizeAngle = function(angle) {
            return l2js.utils.normalizeAngle(angle);
        };

        Turtle2DBuilder.prototype._colorToHexString = function(color) {
            return l2js.utils.colorToHexString(color);
        };

        Turtle2DBuilder.prototype._symbols = {
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
                var turtle2D = this.ctx.turtle2D;
                var newPos = Turtle2DBuilder.turtleTransforms.forward(step, turtle2D.turtle);

                turtle2D.baseLayer.add(new Kinetic.Line({
                    points: [turtle2D.turtle.position[0], turtle2D.turtle.position[1], newPos[0], newPos[1]],
                    stroke: color.hex,
                    strokeWidth: stroke,
                    lineCap: 'round',
                    lineJoin: 'round',
                    opacity: color.a
                }));

                turtle2D.baseLayer.batchDraw();
                turtle2D.turtle.position = newPos;
            },
            /**
             *
             * Move by step
             * f(step)
             * @param {Object} symbol
             */
            'f': function(symbol) {
                var step = this._normalizeStep(symbol.arguments[0]);
                var turtle2D = this.ctx.turtle2D;
                var newPos = Turtle2DBuilder.turtleTransforms.forward(step, turtle2D.turtle);
                turtle2D.turtle.position = newPos;
            },
            /**
             * Turn left
             *
             * L(angle)
             *
             * @param {Object} symbol
             */
            'L': function(symbol) {
                var turtle = this.ctx.turtle2D.turtle;
                var angle = symbol.arguments[0];
                angle && (turtle.orientation = this._normalizeAngle(turtle.orientation - angle));

            },
            'R': function(symbol) {
                var turtle = this.ctx.turtle2D.turtle;
                var angle = symbol.arguments[0];
                angle && (turtle.orientation = this._normalizeAngle(turtle.orientation + angle));
            },
            '[': function(symbol) {
                var turtle2D = this.ctx.turtle2D;
                turtle2D.stack = turtle2D.stack || [];
                turtle2D.stack.unshift(l2js.utils.copy(turtle2D.turtle));
            },
            ']': function(symbol) {
                var turtle2D = this.ctx.turtle2D;
                if (l2js.utils.isUndefined(turtle2D.stack) || !turtle2D.stack.length) {
                    this._handleError('Cannot read from undefined of empty indices stack.');
                }
                turtle2D.turtle = turtle2D.stack.shift();
            },
            /**
             * Start of polygon
             *
             * PU(fillColor, stroke, strokeColor)
             *
             * @param {Object} symbol
             */
            'PU': function(symbol) {
                var turtle2D = this.ctx.turtle2D,
                    poly, fillColor, stroke, strokeColor;
                turtle2D.polyStack = turtle2D.polyStack || [];
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

                turtle2D.baseLayer.add(poly);
                turtle2D.polyStack.unshift(poly);
            },
            /**
             * End of Polygon
             * @param {Object} symbol
             */
            'PS': function(symbol) {
                var turtle2D = this.ctx.turtle2D;
                if (l2js.utils.isUndefined(turtle2D.polyStack) || !turtle2D.polyStack.length) {
                    //this._handleError('Cannot read from undefined of empty polygon stack.');
                    return;
                }
                turtle2D.polyStack.shift();
            },
            /**
             * Add vertex to polygon
             * @param {Object} symbol
             */
            'V': function(symbol) {
                var turtle2D = this.ctx.turtle2D,
                    turtle = turtle2D.turtle;
                if (l2js.utils.isUndefined(turtle2D.polyStack) || !turtle2D.polyStack.length) {
                    //this._handleError('Cannot read from undefined of empty polygon stack.');
                    return;
                }
                var poly = turtle2D.polyStack[0];
                poly.points(poly.points().concat(turtle.position));
                turtle2D.baseLayer.batchDraw();
            }
        };

        return Turtle2DBuilder;

    })();

}(window.l2js);
