(function() {
    'use strict';

    angular
        .module("phidias-ui")
        .directive("phiMenu", phiMenu)
        .directive("phiSubmenu", phiSubmenu)
        .directive("phiMenuItem", phiMenuItem);


    function phiMenu() {
        return {
            restrict: "E",

            scope: {
                "onSelect": "&"
            },

            controller: ["$scope", function($scope) {
                this.select = function(item) {
                    $scope.onSelect(item);
                };
            }]
        };
    }

    function phiSubmenu() {

        return {
            restrict: "E",
            require: "^phiMenu",
            scope: {
                "label": "@"
            },

            transclude: true,

            template: '<a class="phi-submenu-label" ng-bind="label" tabindex="0" ng-click="toggle()"></a>' +
                      '<div class="phi-submenu-contents" ng-transclude></div>',

            link: function(scope, element, attributes, phiMenuController)  {

                scope.setExpanded = function(expanded) {

                    scope.expanded = expanded;

                    if (scope.expanded) {
                        element.attr("expanded", "expanded");
                        element.find("div").find("a").attr("tabindex", 0);
                    } else {
                        element.removeAttr("expanded");
                        element.find("div").find("a").attr("tabindex", -1);
                    }
                };

                scope.toggle = function() {
                    scope.setExpanded(!scope.expanded);
                };

                scope.setExpanded(false);

                var items = element.find('a');
                for (var index = 0; index < items.length; index++) {
                    if (angular.element(items[index]).attr("active") !== undefined) {
                        scope.setExpanded(true);
                        break;
                    }
                }
            }

        };
    }

    function phiMenuItem() {

        return {
            restrict: "E",
            require: "^phiMenu",
            template: "<a ng-transclude></a>",
            transclude: true,

            link: function(scope, element, attributes, phiMenuController) {
                element.on("click", function() {
                    phiMenuController.select(element);
                });
            }
        };

    }

})();
