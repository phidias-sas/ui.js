/* Based on http://www.bennadel.com/blog/2756-experimenting-with-ngmodel-and-ngmodelcontroller-in-angularjs.htm */

(function() {
'use strict';

angular
    .module("phidias-ui")
    .directive("phiSelect", phiSelect)
    .directive("phiOption", phiOption);

function phiSelect() {

    var phiSelectLinkCounter = 0;

    return {

        restrict: "E",
        require: "?ngModel",

        transclude: true,
        template:  '<div id="{{vm.uniqueId}}" class="phi-select-face" ng-click="vm.expand()" ng-class="{\'phi-select-expanded\': vm.isExpanded}">' +
                       '<div ng-show="!vm.isExpanded" class="phi-select-value"></div>' +
                       '<input ng-show="!!vm.isExpanded" type="text" ng-model="vm.query" tabindex="-1" size="2" />' +
                   '</div>' +
                   '<phi-menu ng-transclude phi-texture="paper" phi-tooltip-for="{{vm.uniqueId}}" phi-visible="{{vm.isExpanded}}" phi-visible-animation="slide-bottom"></phi-menu>',

        scope: {
            onSearch: "&phiOnSearch"
        },

        controller:       phiSelectController,
        controllerAs:     "vm",
        bindToController: true,

        link: phiSelectLink

    };


    function phiSelectLink(scope, element, attrs, ngModel) {

        // Prepare element
        scope.vm.uniqueId = "phiSelect" + (++phiSelectLinkCounter);
        element.data("phiSelectLinkId", scope.vm.uniqueId);
        element.on("focus", scope.vm.expand);

        var displayElement = angular.element(element.find('div')[1]);


        // Let the controller access ngModel
        scope.vm.ngModel = ngModel;

        // $render() triggers when the ng-model value has changed
        ngModel.$render = function() {
            var optionElement = findOptionWithValue(ngModel.$viewValue);
            displayElement.html(optionElement ? optionElement.html() : ngModel.$viewValue);
        };

        function findOptionWithValue(value) {

            if (!value) {
                value = "";
            }

            var options = element.find('phi-option');

            for ( var i = 0; i < options.length; i++ ) {
                var option = angular.element( options[i] );
                if (option.attr("value") == value) {
                    return option;
                }
            }

            return null;

        };

        scope.$watch("vm.query", function(newValue, oldValue) {
            if (newValue == oldValue) {
                return;
            }
            scope.vm.onSearch({query: newValue});
        });

    };


    phiSelectController.$inject = ["$scope", "$document", "$element", "$timeout"];
    function phiSelectController($scope, $document, $element, $timeout) {

        var vm = this;

        vm.query = null;

        vm.setValue = function(value) {
            vm.collapse();
            vm.ngModel.$setViewValue(value);
            vm.ngModel.$render();
        }

        // Expand / collapse behavior

        vm.isExpanded = false;

        vm.expand = function() {

            if (vm.isExpanded) {
                return;
            }

            vm.isExpanded = true;

            $timeout(function() {
                $element.find("input")[0].focus();
            }, 0);

            $document.bind('click', documentClicked);

            vm.onSearch();
        };

        vm.collapse = function() {
            vm.isExpanded = false;
            $document.unbind('click', documentClicked);
        };

        vm.toggle = function() {
            vm.isExpanded ? vm.collapse() : vm.expand();
        };

        // Attach child
        vm.attachOptionElement = function(element) {

            element.on("click", function() {
                vm.setValue(element.attr("value"));
            });

        };


        function documentClicked(e) {

            // Ignore clicks within element
            if (angular.element(e.target).inheritedData('phiSelectLinkId') == $element.data('phiSelectLinkId')) {
                return;
            }

            $scope.$apply(vm.collapse);
        };


    };

};


function phiOption() {

    return {
        restrict:   "E",
        require:    "^phiSelect",
        template:   '<a ng-transclude></a>',
        transclude: true,

        link: function(scope, element, attributes, phiSelect) {
            phiSelect.attachOptionElement(element);
        }
    };

};


})();