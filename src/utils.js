'use strict';

/**
 * Utility methods
 */
window.l2js && function(l2js) {

	(function() {

		/**
		 * Decimal adjustment of a number.
		 *
		 * @param	{String}	type	The type of adjustment.
		 * @param	{Number}	value	The number.
		 * @param	{Integer}	exp		The exponent (the 10 logarithm of the adjustment base).
		 * @returns	{Number}			The adjusted value.
		 */
		function decimalAdjust(type, value, exp) {
			// If the exp is undefined or zero...
			if ( typeof exp === 'undefined' || +exp === 0) {
				return Math[type](value);
			}
			value = +value;
			exp = +exp;
			// If the value is not a number or the exp is not an integer...
			if (isNaN(value) || !( typeof exp === 'number' && exp % 1 === 0)) {
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
		copy : function(obj) {
			if (l2js.utils.isUndefined(obj) || typeof obj !== "object" || obj === null) {
				return obj;
			}

			var out = new obj.constructor();

			for (var key in obj) {
				out[key] = l2js.utils.copy(obj[key]);
			}
			return out;
		},

		hasProp : {}.hasOwnProperty,

		// coffeescript
		extend : function(child, parent) {
			for (var key in parent) {
				if (l2js.utils.hasProp.call(parent, key))
					child[key] = parent[key];
			}
			function ctor() {
				this.constructor = child;
			}


			ctor.prototype = parent.prototype;
			child.prototype = new ctor();
			child.__super__ = parent.prototype;
			return child;
		},

		// prototype
		indexOf : function(arr, item, i) {
			i || ( i = 0);
			var length = arr.length;
			if (i < 0)
				i = length + i;
			for (; i < length; i++)
				if (arr[i] === item)
					return i;
			return -1;
		},

		isUndefined : function(v) {
			return typeof v === 'undefined';
		},
		isFunction : function(functionToCheck) {
			var getType = {};
			return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
		},
		toUpperFirstLetter : function(string) {
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
		padLeft : function(str, padChar, length) {

			while (str.length < length)
			str = padChar + str;
			return str;
		},
		normalizeAngle: function(angle) {
			var interval = angle % 360;
			return angle < 0 ? 360 + interval : interval;
		},
		HSVToRGB: function(color) {
			var h = l2js.utils.normalizeAngle(color.h);
			var s = color.s < 0 ? 0 : (color.s > 1 ? 1 : color.s);
			var v = color.v < 0 ? 0 : (color.v > 1 ? 1 : color.v);

			var C = v * s;
			var X = C * (1 - Math.abs((h / 60) % 2 - 1));
			var m = v - C;

			var rgb_;
			if (h < 60) {
				rgb_ = [C, X, 0];
			} else if (60 <= h < 120) {
				rgb_ = [X, C, 0];
			} else if (120 <= h < 180) {
				rgb_ = [0, C, X];
			} else if (180 <= h < 240) {
				rgb_ = [0, X, C];
			} else if (240 <= h < 300) {
				rgb_ = [X, 0, C];
			} else if (300 <= h <= 360) {
				rgb_ = [C, 0, X];
			}

			var r = (rgb_[0] + m) * 255;
			var g = (rgb_[1] + m) * 255;
			var b = (rgb_[2] + m) * 255;
			
			return {model: "rgb", r: r, g: g, b: b, a:color.a};
		},
		RGBToInt : function(color) {
			
			function norm(c) {
				return c;
				return (!c||c<0)?0:((c>255)?255:c);
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
		colorToHexString:function(colorInt) {
			function hexStringToInt(str) {
				return parseInt(str, 16);
			};
			var hexStrAlpha = l2js.utils.padLeft(Math.round(4294967295 * colorInt).toString(16), 0, 8); 
			return {
				hex : '#' + hexStrAlpha.substring(0, 6),		
				r : hexStringToInt(hexStrAlpha.substring(0, 2)),
				g : hexStringToInt(hexStrAlpha.substring(2, 4)),
				b : hexStringToInt(hexStrAlpha.substring(4, 6)),
				a : hexStringToInt(hexStrAlpha.substring(6, 8))/256
			};
		}

	};
}(window.l2js);
