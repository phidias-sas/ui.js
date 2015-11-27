/*

someObject = {
    title: "Object title",
    description: "Some description"
}


<phi-object type="book" ng-model="someObject" controller-as="myBook"></phi-object>

<phi-button ng-click="myBook.go('edit')">Editar</phi-button>


*/
(function() {
    'use strict';

    angular
        .module("phidias-ui")
        .directive("phiObject", phiObject);

    function phiObject() {

        return {

            restrict: "E",

            scope: {
                type:         "@",
                controllerAs: "=",
                ngModel:      "=",
                onChange:     "&",
                onDestroy:    "&"
            },

            controller:       phiObjectController,
            controllerAs:     "vm"

        };

    };


    phiObjectController.$inject = ["$scope", "$element", "$controller", "$compile"];
    function phiObjectController($scope, $element, $controller, $compile) {

        var scope;
        var objectService;

        var vm          = this;

        vm.ngModel      = $scope.ngModel;
        vm.onChange     = $scope.onChange;
        vm.onDestroy    = $scope.onDestroy;

        vm.states       = [];
        vm.currentState = null;
        vm.go           = go;

        vm.isLoading    = false;
        vm.setLoading   = setLoading;

        vm.change       = change;
        vm.destroy      = destroy;


        /* Load states from corresponding service */
        objectService   = loadObjectService($scope.type, vm);
        vm.states       = objectService.states;


        /* Setup external controller */
        vm.controller = {
            states:       Object.keys(vm.states),
            currentState: vm.currentState,
            go:           go,
            isLoading:    vm.isLoading
        };

        if ($scope.controllerAs != undefined) {
            $scope.controllerAs = vm.controller;
        }

        /* Run object initialization */
        if (typeof objectService.initialize == "function") {
            objectService.initialize();
        } else if (vm.states.length) {
            vm.go(Object.keys(vm.states)[0]);
        }

        /////////////

        function go(targetStateName) {

            if (vm.states[targetStateName] === undefined || vm.currentState == targetStateName) {
                return;
            }

            if (scope) {
                scope.$destroy();
                scope = null;
            }

            scope = $scope.$new(true);
            scope.phiObject = vm;

            $element.removeClass("phi-object-state-"+vm.currentState);
            $element.addClass("phi-object-state-"+targetStateName);

            vm.currentState            = targetStateName;
            vm.controller.currentState = targetStateName;

            var targetState = vm.states[targetStateName];

            if (targetState.controller) {

                var controllerObj = $controller(targetState.controller, {'$scope': scope});

                if (targetState.controllerAs) {
                    scope[targetState.controllerAs] = controllerObj;
                }
            }

            if (targetState.template) {
                var e = $compile(targetState.template)(scope);
                $element.empty().append(e);
            }

        }

        function change() {
            vm.onChange();
        }

        function destroy() {
            vm.onDestroy();
        }

        function setLoading(isLoading) {
            vm.isLoading            = isLoading;
            vm.controller.isLoading = isLoading;
        }

    };


    function loadObjectService(type, vm) {

        var words = type.split("-").map(function(word) {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        });

        var serviceName  = "phiObject" + words.join("");

        try {
            var blockFactory = angular.element(document.body).injector().get(serviceName);
            return blockFactory(vm);
        } catch (err) {
            console.log("Block service " + serviceName + " not found");
            return {states: []};
        }

    };

})();