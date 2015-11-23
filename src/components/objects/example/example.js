(function() {
    'use strict';

    angular
        .module("phidias-ui")
        .factory("phiObjectExample", phiObjectExample);

    function phiObjectExample() {

        return function(phiObject) {

            return {

                initialize: function() {
                    phiObject.go("view");
                },

                states: {

                    view: {
                        controller: exampleController,
                        controllerAs: 'vm',
                        template:   '<div>' + 
                                        '<h1 ng-bind="vm.model.title"></h1>' + 
                                        '<p ng-bind="vm.model.avatar"></p>' + 
                                    '</div>'
                    },

                    form: {
                        controller: exampleController,
                        controllerAs: 'vm',
                        template:   '<div>' + 
                                        '<input type="text" ng-model="vm.model.title"></input>' + 
                                        '<input type="text" ng-model="vm.model.avatar"></input>' + 
                                    '</div>'
                    },

                    dump: {
                        controller: exampleController,
                        controllerAs: 'vm',
                        template: '<pre>{{vm.model}}</pre>'
                    }

                }

            }

            //////////////////////

            function exampleController() {
                var vm   = this;
                vm.model = phiObject.ngModel;
            }

        }

    }

})();