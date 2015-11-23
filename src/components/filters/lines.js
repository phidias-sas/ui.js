(function() {
    'use strict';

    angular
        .module("phidias-ui")
        .filter("lines", lines);

    function lines() {
        return function(text) {

            var retval = [];

            if (text == undefined) {
                return retval;
            }

            text.split("\n").map(function(line) {
                var trimmed = line.trim();
                if (trimmed.length > 0) {
                    retval.push(trimmed);
                }
            });

            return retval;
        };
    }

})();