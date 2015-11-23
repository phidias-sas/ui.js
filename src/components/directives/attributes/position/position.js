angular.module("phidias-ui").directive("phiPosition", ["phiCoordinates", function(phiCoordinates) {

    return {

        restrict: "A",

        scope: {},

        link: function(scope, element, attributes)  {

            element.parent().css("position", "relative");
            element.css("position", "absolute");

            scope.reposition = function(positionString) {

                var boundingRect = phiCoordinates.getBounds(element);
                var alignment    = phiCoordinates.parseAlignmentString(positionString) || {vertical: "top", horizontal: "left"};

                var coordinates  = {
                    top:        "auto",
                    left:       "auto",
                    bottom:     "auto",
                    right:      "auto",
                    marginTop:  0,
                    marginLeft: 0
                };

                switch (alignment.vertical) {

                    case "top":
                        coordinates.top = "10px";
                    break;

                    case "center":
                        coordinates.top       = "50%";
                        coordinates.marginTop = (boundingRect.height * -0.5) + "px";
                    break;

                    case "bottom":
                        coordinates.bottom = "10px";
                    break;

                }

                switch (alignment.horizontal) {

                    case "left":
                        coordinates.left = "10px";
                    break;

                    case "center":
                        coordinates.left       = "50%";
                        coordinates.marginLeft = (boundingRect.width * -0.5) + "px";
                    break;

                    case "right":
                        coordinates.right = "10px";
                    break;

                }

                element.css(coordinates);

            };

            attributes.$observe("phiPosition", function(positionString) {
                scope.reposition(positionString);
            });

        }
    };

}]);
