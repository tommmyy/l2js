'use strict';

/**
 * Utility methods
 */
window.l2js && function(l2js) {
	
	l2js.utils = {
		copy: function (obj) {
			if (l2js.utils.isUndefined(obj) || typeof obj !== "object") {
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
		extend: function (child, parent) {
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
		indexOf: function (arr, item, i) {
			i || ( i = 0);
			var length = arr.length;
			if (i < 0)
				i = length + i;
			for (; i < length; i++)
				if (arr[i] === item)
					return i;
			return -1;
		},

		isUndefined: function (v) {
			return typeof v === 'undefined';
		}, 
		isFunction:function (functionToCheck) {
		 var getType = {};
		 return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
		},
		toUpperFirstLetter: function (string) {
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
		padLeft: function (str, padChar, length) { 
		
		    while(str.length < length) 
		        str = padChar + str;
		    return str; 
		} 	
	};
}(window.l2js);