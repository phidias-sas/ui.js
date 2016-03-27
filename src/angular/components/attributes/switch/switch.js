/*
This directive will simply set the "phi-switch-active" class (and optionally the class you specify via phi-switch-active-class="") to one child element at a time 
and provide controls to select the active item.  All styling should be defined in your stylesheets

Usage:

//have a local variable "controls" which will be populated with the switch's controls functions:

<div phi-switch="controls" phi-switch-active-class="myOwnClass">
    <div>Element 1</div>
    <div>Element 2</div>
    ....
</div>

<h1>Now showing {{controls.activeIndex}}</h1>

<button ng-click="controls.select(2)">See index 2</button>
<button ng-click="controls.previous()" ng-disabled="!controls.hasPrevious()">prev</button>
<button ng-click="controls.next()" ng-disabled="!controls.hasNext()">next</button>

*/


(function() {
    'use strict';


    angular
        .module("phidias-ui")
        .directive("phiSwitch", phiSwitch);


    phiSwitch.$inject = ["$timeout"];
    function phiSwitch($timeout) {

        return {

            restrict: "A",

            scope: {
                controls:        "=phiSwitch",
                customClassName: "@phiSwitchActiveClass"
            },

            link: phiSwitchLink
        };


        function phiSwitchLink(scope, element, attributes)  {

            var items  = [];

            scope.activeClass = "phi-switch-active" + (scope.customClassName ? " "+scope.customClassName : "");
            scope.controls    = scope.controls != undefined ? scope.controls : {};

            scope.controls = {

                activeIndex: null,
                length:      0,

                select: function(targetIndex) {

                    items       = element.children();
                    this.length = items.length;

                    if (!items.length) {
                        return;
                    }

                    //only allow from 0 to items.length
                    //targetIndex = Math.min(Math.max(targetIndex, 0), items.length);

                    //cycle
                    if (targetIndex >= items.length) {
                        targetIndex = targetIndex % items.length;
                    } else if (targetIndex < 0) {
                        targetIndex = items.length + targetIndex;
                    }

                    if (items[targetIndex] == undefined) {
                        return;
                    }

                    if (this.activeIndex !== null && items[this.activeIndex] != undefined) {
                        angular.element(items[this.activeIndex]).removeClass(scope.activeClass);
                    }

                    angular.element(items[targetIndex]).addClass(scope.activeClass);
                    this.activeIndex = targetIndex;
                },

                next: function() {
                    scope.controls.select(scope.controls.activeIndex + 1);
                },

                previous: function() {
                    scope.controls.select(scope.controls.activeIndex - 1);
                },

                hasNext: function() {
                    return items[scope.controls.activeIndex + 1] != undefined;
                },

                hasPrevious: function() {
                    return items[scope.controls.activeIndex - 1] != undefined;
                }

            };



            // scope.$watch(function () {

            //     items                 = element.children();
            //     scope.controls.length = items.length;

            //     if (scope.controls.activeIndex == null) {
            //         scope.controls.activeIndex = 0;
            //     }

            //     if (items[scope.controls.activeIndex] != undefined) {
            //         angular.element(items[scope.controls.activeIndex]).addClass(scope.activeClass);
            //     }


            // });


        };

    };

})();
