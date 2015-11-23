/*
The phi-modal attribute only moves the element to the bottom of the body.
visibility can be established with the phi-visible attribute, and styling
is entirely up to the document
*/

(function() {
    'use strict';

    angular
        .module("phidias-ui")
        .directive("phiModal", phiModal);

    phiModal.$inject = ["$document"];
    function phiModal($document) {

        return {
            restrict: "A",

            link: function(scope, element, attributes)  {

                angular.element($document[0].body).append(element);

                scope.$on("$destroy", function() {
                    element.remove();
                });

            }
        };        
    };

})();