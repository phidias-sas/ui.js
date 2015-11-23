//phi-viewport-leave(-start)
//phi-viewport-leave-end

//phi-viewport-enter(-start)
//phi-viewport-enter-end

angular.module("phidias-ui").directive("phiViewportLeave", ["$window", "phiCoordinates", "$timeout", function($window, phiCoordinates, $timeout) {

    return {

        restrict: "A",

        link: function(scope, element, attributes) {

            var lastY = $window.scrollY;

            angular.element($window).bind("scroll", function() {

                var bounds     = phiCoordinates.getBounds(element);
                var leaveEvent = null;

                if (lastY < bounds.top && bounds.top <= $window.scrollY) { //leaving from the top
                    leaveEvent = {
                        direction: "up"
                    }
                } else if (lastY + $window.innerHeight > bounds.bottom && bounds.bottom >= $window.scrollY + $window.innerHeight) { //leaving from the bottom
                    leaveEvent = {
                        direction: "down"
                    }
                }

                if (leaveEvent) {
                    scope.$eval(attributes.phiViewportLeave, {event: leaveEvent});
                    scope.$apply();
                }

                lastY = $window.scrollY;

            });

        }

    };


}]);



angular.module("phidias-ui").directive("phiViewportLeaveEnd", ["$window", "phiCoordinates", "$timeout", function($window, phiCoordinates, $timeout) {

    return {

        restrict: "A",

        link: function(scope, element, attributes) {

            var lastY = $window.scrollY;

            scope.scrollListener = function() {

                var bounds     = phiCoordinates.getBounds(element);
                var leaveEvent = null;

                if (lastY < bounds.bottom && bounds.bottom <= $window.scrollY) { //leaving from the top
                    leaveEvent = {
                        direction: "up"
                    }
                } else if (lastY + $window.innerHeight > bounds.top && bounds.top >= $window.scrollY + $window.innerHeight) { //leaving from the bottom
                    leaveEvent = {
                        direction: "down"
                    }
                }

                if (leaveEvent) {
                    scope.$eval(attributes.phiViewportLeaveEnd, {event: leaveEvent});
                    scope.$apply();
                }

                lastY = $window.scrollY;
            };


            angular.element($window).bind("scroll", scope.scrollListener);

            element.on('$destroy', function() {
                angular.element($window).unbind("scroll", scope.scrollListener);
            });

        }

    };


}]);




angular.module("phidias-ui").directive("phiViewportEnter", ["$window", "phiCoordinates", "$timeout", function($window, phiCoordinates, $timeout) {

    return {

        restrict: "A",

        link: function(scope, element, attributes) {

            var lastY = $window.scrollY;

            angular.element($window).bind("scroll", function() {

                var bounds     = phiCoordinates.getBounds(element);
                var enterEvent = null;

                if (lastY + $window.innerHeight < bounds.top && bounds.top <= $window.scrollY + $window.innerHeight) { //entering from the top
                    enterEvent = {
                        direction: "up"
                    }
                } else if (lastY > bounds.bottom && bounds.bottom >= $window.scrollY) { //entering from the bottom
                    enterEvent = {
                        direction: "down"
                    }
                }

                if (enterEvent) {
                    scope.$eval(attributes.phiViewportEnter, {event: enterEvent});
                    scope.$apply();
                }

                lastY = $window.scrollY;

            });

        }

    };


}]);





angular.module("phidias-ui").directive("phiViewportEnterEnd", ["$window", "phiCoordinates", "$timeout", function($window, phiCoordinates, $timeout) {

    return {

        restrict: "A",

        link: function(scope, element, attributes) {

            var lastY = $window.scrollY;

            angular.element($window).bind("scroll", function() {

                var bounds     = phiCoordinates.getBounds(element);
                var enterEvent = null;

                if (lastY + $window.innerHeight < bounds.bottom && bounds.bottom <= $window.scrollY + $window.innerHeight) { //entering from the top
                    enterEvent = {
                        direction: "up"
                    }
                } else if (lastY > bounds.top && bounds.top >= $window.scrollY) { //entering from the bottom
                    enterEvent = {
                        direction: "down"
                    }
                }

                if (enterEvent) {
                    scope.$eval(attributes.phiViewportEnterEnd, {event: enterEvent});
                    scope.$apply();
                }

                lastY = $window.scrollY;

            });

        }

    };


}]);
