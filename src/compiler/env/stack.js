'use strict';

window.l2js && window.l2js.utils && window.l2js.compiler && window.l2js.compiler.env && function(l2js) {

    l2js.compiler.env.Stack = (function() {

        function Stack(start, end, string) {
            this.start = start;
            this.end = end;
            this.string = string;
            this.type = "stack";

        }

        return Stack;

    })();

}(window.l2js);
