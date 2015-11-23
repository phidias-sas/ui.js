/*
phi-cover is esentially a shorthand way of creating a <div> with a background-image css property

<phi-cover src="foo.jpg" />

will produce

<div style="background-image: url('foo.jpg')"></div>
*/

(function() {
    'use strict';

    angular.module("phidias-ui")
        .directive("phiCover", phiCover);

    function phiCover() {

        return {
            restrict: 'E',

            scope: {
                src: "@",
                'default': "@"
            },

            link: function(scope, element, attributes) {

                attributes.$observe("src", function(src) {

                    var backgrounds = [];

                    if (src) {
                        backgrounds.push("url('"+src+"')");
                    }

                    if (scope['default']) {
                        backgrounds.push("url('"+scope['default']+"')");
                    }

                    if (backgrounds.length) {
                        element.css("background-image", backgrounds.join());
                    }

                });

            }
        };

    };

})();