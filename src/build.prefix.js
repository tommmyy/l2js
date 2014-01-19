/*!
* L-System to Javascript Library v@VERSION
*
* Copyright 2013, 2013 Tomáš Konrády (tomas.konrady@uhk.cz)
* Released under the MIT license
*
* Date: @DATE
*/

(function( global, factory ) {

        if ( typeof module === "object" && typeof module.exports === "object" ) {
                // For CommonJS and CommonJS-like environments where a proper window is present,
                // execute the factory and get jQuery
                // For environments that do not inherently posses a window with a document
                // (such as Node.js), expose a jQuery-making factory as module.exports
                // This accentuates the need for the creation of a real window
                // e.g. var jQuery = require("jquery")(window);
                // See ticket #14549 for more info
                module.exports = global.document ?
                        factory( global ) :
                        function( w ) {
                                if ( !w.document ) {
                                        throw new Error( "l2js requires a window with a document" );
                                }
                                return factory( w );
                        };
        } else {
                factory( global );
        }

// Pass this, window may not be defined yet
}(this, function( window ) {