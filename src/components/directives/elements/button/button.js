(function() {
    'use strict';

    angular
        .module("phidias-ui")
        .directive("phiButton", phiButtonDirective);


    function phiButtonDirective() {

        return {
            restrict:   "E",
            transclude: true,
            template:   "<button phi-button ng-transclude></button>",
            replace:    true
        }

    }

})();