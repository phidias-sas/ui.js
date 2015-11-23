(function() {
    'use strict';

    angular
        .module("phidias-ui")
        .directive("phiTooltipFor", phiTooltipFor);


    phiTooltipFor.$inject = ["phiCoordinates"];
    function phiTooltipFor(phiCoordinates) {

        return {
            restrict: "A",
            link: phiTooltipForLink
        };


        function phiTooltipForLink(scope, element, attributes) {

            element.css("position", "absolute");

            attributes.$observe("phiTooltipFor", function() {
                reposition();
            });

            attributes.$observe("phiTooltipAlign", function() {
                reposition();
            });

            attributes.$observe("phiTooltipOrigin", function() {
                reposition();
            });

            attributes.$observe("phiVisible", function() {
                reposition();
            });


            function reposition() {

                var parentElement = angular.element(document.getElementById(attributes.phiTooltipFor));

                if (!parentElement.length) {
                    return;
                }

                var parentCoordinates = phiCoordinates.getBounds(parentElement);
                var localCoordinates  = phiCoordinates.getBounds(element);

                var coordinates = {
                    top:  0,
                    left: 0
                };

                var alignment = phiCoordinates.parseAlignmentString(attributes.phiTooltipAlign) || {vertical: "bottom", horizontal: "left"};

                switch (alignment.vertical) {
                    case "top":
                        coordinates.top += parentCoordinates.top;
                    break;

                    case "center":
                        coordinates.top += parentCoordinates.top + parentCoordinates.height/2;
                    break;

                    case "bottom":
                        coordinates.top += parentCoordinates.top + parentCoordinates.height;
                    break;
                }

                switch (alignment.horizontal) {
                    case "left":
                        coordinates.left += parentCoordinates.left;
                    break;

                    case "center":
                        coordinates.left += parentCoordinates.left + parentCoordinates.width/2;
                    break;

                    case "right":
                        coordinates.left += parentCoordinates.left + parentCoordinates.width;
                    break;
                }


                var origin = phiCoordinates.parseAlignmentString(attributes.phiTooltipOrigin) || {vertical: "top", horizontal: "left"};

                switch (origin.vertical) {
                    case "bottom":
                        coordinates.top -= localCoordinates.height;
                    break;

                    case "center":
                        coordinates.top -= localCoordinates.height/2;
                    break;
                }

                switch (origin.horizontal) {

                    case "right":
                        coordinates.left -= localCoordinates.width;
                    break;

                    case "center":
                        coordinates.left -= localCoordinates.width/2;
                    break;
                }


                var elementCoordinates = {
                    top:    coordinates.top+"px",
                    left:   coordinates.left+"px",
                    right:  "auto",
                    bottom: "auto"
                };

                if (attributes.phiTooltipMatch == "width") {
                    elementCoordinates.minWidth = parentCoordinates.width+"px";
                } else if (attributes.phiTooltipMatch == "height") {
                    elementCoordinates.minHeight = parentCoordinates.height+"px";
                }

                element.css(elementCoordinates);
            };


        };

    };


})();