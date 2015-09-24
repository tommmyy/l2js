'use strict';

/**
 * Interpret of the symbols of L-system. Used Builder design pattern.
 *
 * @class
 */

window.l2js && window.l2js.utils && window.l2js.interpret && function(l2js) {
    var utils = window.l2js.utils;
    l2js.interpret.Turtle2DBuilder = (function() {
        function Turtle2DBuilderPixi(options) {
            this.options = options;
            this.symbolsStack = [];
            this.ctx = {};
            this._isDone = false;
            this._isRunning = false;
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
        Turtle2DBuilderPixi.prototype.done = function(symbol) {
            if (this.ctx.turtle2DPixi) {
                console.log("Turtle2DBuilderPixi done")
                this._isDone = true;
            }
        }

        Turtle2DBuilderPixi.prototype._handleError = function(err) {
            this._stopAnimation();
            throw new Error(err);
        };

        Turtle2DBuilderPixi.prototype._resolveNextSymbol = function() {
            var symbol = this.symbolsStack.shift();

            if (this._symbols[symbol.symbol]) {
                this._symbols[symbol.symbol].call(this, symbol);
            } else if (!this.options.skipUnknownSymbols) {
                this._handleError('Unexpected symbol (\'' + symbol.symbol + '\')');
            }
        };

        Turtle2DBuilderPixi.prototype._init = function() {
            console.log("Init Turtle2DBuilderPixi");
            this.options = l2js.utils.extend(l2js.utils.copy(Turtle2DBuilderPixi.options), this.options);
            if (!this.options.container) {
                this._handleError("Turtle2D should have set the container to draw on.");
            }

            var turtle2DPixi = this.ctx.turtle2DPixi = {},
                opts = this.options;

            // Remderer
            turtle2DPixi.renderer = PIXI.autoDetectRenderer(opts.width, opts.height, {
                backgroundColor: utils.colorHexToInt(opts.bgColor)
            });
            var node = document.querySelector("#" + opts.container);

            if (node.childNodes.length) {
                node.removeChild(node.childNodes[0])
            }
            node.appendChild(turtle2DPixi.renderer.view);

            turtle2DPixi.stage = new PIXI.Container();
            turtle2DPixi.stack = [];
            turtle2DPixi.turtle = {
                position: opts.turtle.initPosition,
                orientation: opts.turtle.initOrientation
            };
            this.symbolsStack = [];
            this._initAnimation(turtle2DPixi);

        };

        Turtle2DBuilderPixi.prototype._initAnimation = function() {
            this._stopAnimation();
        };

        Turtle2DBuilderPixi.prototype._startAnimation = function() {
            if (this._isRunning) {
                return;
            }

            var that = this,
                start = null,
                numOfSymbols = 0,
                progress = 0,
                diff = 0,
                turtle2DPixi = this.ctx.turtle2DPixi;

            that._isRunning = true;
            console.log("Start")
            var step = function(timestamp) {
                var i,
                    //TODO: Refactor to perSecond
                    perSecond = that.options.symbolsPerFrame || 1;

                if (!start) {
                    start = timestamp;
                }
                diff = timestamp - start;
                progress += diff;
                start = timestamp;
                numOfSymbols += perSecond / 1000 * diff;

                if (numOfSymbols > 1) {
                    for (i = 0; i < numOfSymbols && that.symbolsStack.length; i++) {
                        that._resolveNextSymbol();
                    }
                    numOfSymbols = numOfSymbols - parseInt(numOfSymbols, 10);
                }

                if (progress > 100) {
                    turtle2DPixi.renderer.render(turtle2DPixi.stage);
                    progress = 0;
                }


                if (that._isRunning && that.symbolsStack.length) {
                    requestAnimationFrame(step);
                } else if (that._isDone && !that.symbolsStack.length) {
                    that.ctx.turtle2DPixi = null;
                }
            }
            requestAnimationFrame(step);
        };

        Turtle2DBuilderPixi.prototype._stopAnimation = function() {
            this._isRunning = false;
        };

        Turtle2DBuilderPixi.prototype._normalizeStep = function(step) {
            var rough = step > 1 ? 1 : step;

            return rough * Math.max(this.options.width, this.options.height);
        };

        Turtle2DBuilderPixi.prototype._normalizeAngle = function(angle) {
            return l2js.utils.normalizeAngle(angle);
        };

        Turtle2DBuilderPixi.prototype._colorToHexString = function(color) {
            return utils.colorToHexString(color);
        };

        Turtle2DBuilderPixi.prototype._getColorAlpha = function(a) {
            return a * 255;
        };

        Turtle2DBuilderPixi.prototype._symbols = {
            /**
             *
             * Forward and draw line
             * F(step, stroke, color)
             * @param {Object} symbol
             */
            'F': function(symbol) {
                var step = this._normalizeStep(symbol.arguments[0]),
                    stroke = this._normalizeStep(symbol.arguments[1]),
                    color = this._colorToHexString(symbol.arguments[2]),
                    turtle2DPixi = this.ctx.turtle2DPixi,
                    pos = turtle2DPixi.turtle.position,
                    newPos = Turtle2DBuilderPixi.turtleTransforms.forward(step, turtle2DPixi.turtle);

                var graphics = new PIXI.Graphics();
                graphics.lineStyle(stroke, utils.colorHexToInt(color.hex), color.a);
                graphics.moveTo(pos[0], pos[1]);
                graphics.lineTo(newPos[0], newPos[1]);
                turtle2DPixi.stage.addChild(graphics);

                turtle2DPixi.turtle.position = newPos;
            },
            'C': function(symbol) {
                var radius = symbol.arguments[0] ? this._normalizeStep(symbol.arguments[0]) : null,
                    color = symbol.arguments[1] ? this._colorToHexString(symbol.arguments[1]) : null,
                    turtle2DPixi = this.ctx.turtle2DPixi,
                    pos = turtle2DPixi.turtle.position,
                    graphics,
                    fill,
                    alpha;

                if (radius == null) {
                    return;
                }
                fill = color != null ? utils.colorHexToInt(color.hex) : 0;
                alpha = color != null ? color.a : 1;
                graphics = new PIXI.Graphics();
                graphics.lineStyle(0);
                graphics.beginFill(fill, alpha);
                graphics.drawCircle(pos[0], pos[1], radius / 2);
                graphics.endFill();
                turtle2DPixi.stage.addChild(graphics);
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
                    polygon, fillColor, stroke, strokeColor, graphics;

                turtle2DPixi.polygonStack = turtle2DPixi.polygonStack || [];
                fillColor = symbol.arguments[0] && this._colorToHexString(symbol.arguments[0]);
                stroke = symbol.arguments[1] && this._normalizeStep(symbol.arguments[1]);
                strokeColor = symbol.arguments[2] && this._colorToHexString(symbol.arguments[2]);

                graphics = new PIXI.Graphics();

                turtle2DPixi.stage.addChild(graphics);
                polygon = {
                    graphics: graphics,
                    points: [],
                    fill: utils.colorHexToInt(fillColor.hex),
                    stroke: strokeColor ? utils.colorHexToInt(strokeColor.hex) : 0,
                    strokeWidth: stroke,
                    opacity: fillColor ? fillColor.a : 1
                };
                turtle2DPixi.polygonStack.unshift(polygon);
                turtle2DPixi.stage.addChild(graphics);
            },
            /**
             * End of Polygon
             * @param {Object} symbol
             */

            'PS': function(symbol) {
                var turtle2DPixi = this.ctx.turtle2DPixi;
                if (l2js.utils.isUndefined(turtle2DPixi.polygonStack) || !turtle2DPixi.polygonStack.length) {
                    return;
                }
                turtle2DPixi.polygonStack.shift();
            },

            /**
             * Add vertex to polygon
             * @param {Object} symbol
             */
            'V': function(symbol) {
                var turtle2DPixi = this.ctx.turtle2DPixi,
                    turtle = turtle2DPixi.turtle,
                    graphics, polygon;

                if (l2js.utils.isUndefined(turtle2DPixi.polygonStack) || !turtle2DPixi.polygonStack.length) {
                    //this._handleError('Cannot read from undefined of empty polygon stack.');
                    return;
                }
                polygon = turtle2DPixi.polygonStack[0];
                polygon.points.push(turtle.position);

                graphics = polygon.graphics;
                graphics.clear();
                graphics.beginFill(polygon.fill, polygon.opacity);
                graphics.lineStyle(polygon.strokeWidth, polygon.stroke, polygon.opacity);
                polygon.points.forEach(function(point, i) {
                    if (i === 0) {
                        graphics.moveTo(point[0], point[1]);
                    } else {
                        graphics.lineTo(point[0], point[1])
                    }
                    return point;
                })
                graphics.endFill();

            }
        };

        return Turtle2DBuilderPixi;

    })();

}(window.l2js);
