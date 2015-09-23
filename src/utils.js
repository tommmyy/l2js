'use strict';
// globals  window
/**
 * Utility methods
 */
window.l2js && function(l2js) {

    (function() {

        /**
         * Decimal adjustment of a number.
         *
         * @param {String}  type  The type of adjustment.
         * @param {Number}  value The number.
         * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
         * @returns {Number}      The adjusted value.
         */
        function decimalAdjust(type, value, exp) {
            // If the exp is undefined or zero...
            if (typeof exp === 'undefined' || +exp === 0) {
                return Math[type](value);
            }
            value = +value;
            exp = +exp;
            // If the value is not a number or the exp is not an integer...
            if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
                return NaN;
            }
            // Shift
            value = value.toString().split('e');
            value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
            // Shift back
            value = value.toString().split('e');
            return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
        }

        // Decimal round
        if (!Math.round10) {
            Math.round10 = function(value, exp) {
                return decimalAdjust('round', value, exp);
            };
        }
        // Decimal floor
        if (!Math.floor10) {
            Math.floor10 = function(value, exp) {
                return decimalAdjust('floor', value, exp);
            };
        }
        // Decimal ceil
        if (!Math.ceil10) {
            Math.ceil10 = function(value, exp) {
                return decimalAdjust('ceil', value, exp);
            };
        }

    })();

    l2js.utils = {
        copy: function(obj) {
            if (l2js.utils.isUndefined(obj) || typeof obj !== 'object' || obj === null) {
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

        extend: function(child, parent) {

            /* jshint newcap:false */
            for (var key in parent) {
                if (l2js.utils.hasProp.call(parent, key)) {
                    child[key] = parent[key];
                }
            }

            function ctor() {
                /*jshint validthis: true */
                this.constructor = child;
            }


            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        },

        // prototype
        indexOf: function(arr, item, i) {
            i || (i = 0);
            var length = arr.length;
            if (i < 0)
                i = length + i;
            for (; i < length; i++)
                if (arr[i] === item)
                    return i;
            return -1;
        },

        isUndefined: function(v) {
            return typeof v === 'undefined';
        },
        isFunction: function(functionToCheck) {
            var getType = {};
            return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
        },
        toUpperFirstLetter: function(string) {
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
        padLeft: function(str, padChar, length) {

            while (str.length < length)
                str = padChar + str;
            return str;
        },
        normalizeAngle: function(angle) {
            var interval = angle % 360;
            return angle < 0 ? 360 + interval : interval;
        },
        HSVToRGB: function(color) {
            var h = l2js.utils.normalizeAngle(color.h) / 360;
            var s = color.s < 0 ? 0 : (color.s > 1 ? 1 : color.s);
            var v = color.v < 0 ? 0 : (color.v > 1 ? 1 : color.v);

            var r, g, b;

            var i = Math.floor(h * 6);
            var f = h * 6 - i;
            var p = v * (1 - s);
            var q = v * (1 - f * s);
            var t = v * (1 - (1 - f) * s);

            switch (i % 6) {
                case 0:
                    r = v, g = t, b = p;
                    break;
                case 1:
                    r = q, g = v, b = p;
                    break;
                case 2:
                    r = p, g = v, b = t;
                    break;
                case 3:
                    r = p, g = q, b = v;
                    break;
                case 4:
                    r = t, g = p, b = v;
                    break;
                case 5:
                    r = v, g = p, b = q;
                    break;
            }

            return {
                model: 'rgb',
                r: r * 255,
                g: g * 255,
                b: b * 255,
                a: color.a
            };
        },
        /* jshint bitwise:false */
        RGBToInt: function(color) {
            function norm(c) {
                return (!c || c < 0) ? 0 : ((c > 255) ? 255 : c);
            }

            var rgba = norm(color.r) || 0;
            rgba = rgba << 8;
            rgba |= norm(color.g);
            rgba = rgba << 8;
            rgba |= norm(color.b);
            rgba = rgba << 8;
            rgba |= norm(color.a);
            rgba = rgba >>> 0;

            return rgba / 4294967295;
        },
        colorToHexString: function(colorInt) {
            function hexStringToInt(str) {
                return parseInt(str, 16);
            }
            var hexStrAlpha = l2js.utils.padLeft(Math.round(4294967295 * colorInt).toString(16), 0, 8);
            return {
                hex: '#' + hexStrAlpha.substring(0, 6),
                r: hexStringToInt(hexStrAlpha.substring(0, 2)),
                g: hexStringToInt(hexStrAlpha.substring(2, 4)),
                b: hexStringToInt(hexStrAlpha.substring(4, 6)),
                a: hexStringToInt(hexStrAlpha.substring(6, 8)) / 256
            };
        },
        deepEquals: function() {
            var i, l, leftChain, rightChain;

            function compare2Objects(x, y) {
                var p;

                // remember that NaN === NaN returns false
                // and isNaN(undefined) returns true
                if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
                    return true;
                }

                // Compare primitives and functions.
                // Check if both arguments link to the same object.
                // Especially useful on step when comparing prototypes
                if (x === y) {
                    return true;
                }

                // Works in case when functions are created in constructor.
                // Comparing dates is a common scenario. Another built-ins?
                // We can even handle functions passed across iframes
                if ((typeof x === 'function' && typeof y === 'function') ||
                    (x instanceof Date && y instanceof Date) ||
                    (x instanceof RegExp && y instanceof RegExp) ||
                    (x instanceof String && y instanceof String) ||
                    (x instanceof Number && y instanceof Number)) {
                    return x.toString() === y.toString();
                }

                // At last checking prototypes as good a we can
                if (!(x instanceof Object && y instanceof Object)) {
                    return false;
                }

                if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
                    return false;
                }

                if (x.constructor !== y.constructor) {
                    return false;
                }

                if (x.prototype !== y.prototype) {
                    return false;
                }

                // Check for infinitive linking loops
                if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
                    return false;
                }

                // Quick checking of one object beeing a subset of another.
                // todo: cache the structure of arguments[0] for performance
                for (p in y) {
                    if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
                        return false;
                    } else if (typeof y[p] !== typeof x[p]) {
                        return false;
                    }
                }

                for (p in x) {
                    if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
                        return false;
                    } else if (typeof y[p] !== typeof x[p]) {
                        return false;
                    }

                    switch (typeof(x[p])) {
                        case 'object':
                        case 'function':

                            leftChain.push(x);
                            rightChain.push(y);

                            if (!compare2Objects(x[p], y[p])) {
                                return false;
                            }

                            leftChain.pop();
                            rightChain.pop();
                            break;

                        default:
                            if (x[p] !== y[p]) {
                                return false;
                            }
                            break;
                    }
                }

                return true;
            }

            if (arguments.length < 1) {
                return true; //Die silently? Don't know how to handle such case, please help...
                // throw 'Need two or more arguments to compare';
            }

            for (i = 1, l = arguments.length; i < l; i++) {

                leftChain = []; //Todo: this can be cached
                rightChain = [];

                if (!compare2Objects(arguments[0], arguments[i])) {
                    return false;
                }
            }

            return true;
        }
    };
}(window.l2js);
