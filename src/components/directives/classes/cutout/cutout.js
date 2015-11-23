angular.module("phidias-ui").directive("phiCutout", [function() {

    return {
        restrict: "C",
        link: function(scope, element, attributes)  {
            element.prepend(angular.element('<div class="phi-cutout-ridge"><div></div><div></div><div></div></div>'));
        }
    };

}]);