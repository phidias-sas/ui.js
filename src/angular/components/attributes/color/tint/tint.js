/*
Creates a containing element tinted with the given hue

<div phi-color-tint="[hue]">
*/

(function() {
    'use strict';

    angular
        .module("phidias-ui")
        .directive("phiColorTint", phiColorTint);


    function phiColorTint() {

        return {
            restrict: "A",
            // template: '<div class="phi-color-tint phi-color-background-{{hue}}" ng-transclude></div>',
            // transclude: true,

            link: function(scope, element, attributes) {
                var hue   = attributes.phiColorTint;
                var theme = attributes.phiColorTheme;
                element.prepend('<div phi-color-theme="'+theme+'" class="phi-color-tint phi-color-background-'+hue+'" />');
            }
        };
    };

})();