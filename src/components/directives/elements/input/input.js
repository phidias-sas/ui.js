/*
Same attributes as polymer's paper-element
*/

angular.module("phidias-ui").directive("phiInput", [function() {

    var phiInputCounter = 1;

    return {
        restrict: "E",

        scope: {
            name:           "@",
            type:           "@",
            label:          "@",
            placeholder:    "@",
            ngModel:        "=",
            ngModelOptions: "=",
            ngChange:       "&",
            ngFocus:        "&",
            ngBlur:         "&",
            maxlength:      "@",
        },

        template:   '<div>' +
                        '<label for="{{elementId}}" ng-bind="label"></label>' +
                        '<input maxlength="{{maxlength}}" type="{{type||\'text\'}}" ng-show="!multiline" placeholder="{{placeholder}}" ng-focus="focus()" ng-blur="blur()" id="{{elementId}}" name="{{name}}" ng-model="ngModel" ng-disabled="state.disabled" ng-model-options="ngModelOptions||{}" />' +
                        '<textarea maxlength="{{maxlength}}" ng-show="multiline" placeholder="{{placeholder}}" ng-focus="focus()" ng-blur="blur()" id="{{elementId}}" name="{{name}}" ng-model="ngModel" ng-disabled="state.disabled" ng-trim="false" ng-model-options="ngModelOptions||{}"></textarea>' +
                    '</div>' +
                    '<hr />',

        link: function(scope, element, attributes)  {

            scope.elementId     = "phi-input-" + phiInputCounter++;
            scope.floatinglabel = (typeof attributes.floatinglabel !== 'undefined') && attributes.floatinglabel !== 'false' && attributes.floatinglabel !== '0';
            scope.multiline     = (typeof attributes.multiline !== 'undefined') && attributes.multiline !== 'false' && attributes.multiline !== '0';

            scope.state = {
                focused:  false,
                empty:    true,
                disabled: (typeof attributes.disabled !== 'undefined') && attributes.disabled !== 'false' && attributes.disabled !== '0'
            };

            /* copy all attributes (except those in scope) to child input */
            var childInput = scope.multiline ? element.find('textarea') : element.find('input');
            for (var property in attributes) {
                if (!scope.hasOwnProperty(property) && property.charAt(0) != '$') {
                    childInput.attr(property, attributes[property]);
                }
            }

            element.toggleClass("phi-input-disabled", scope.state.disabled);

            element.attr("tabindex", -1);

            element.on("focus", function() {
                var inputElement = scope.multiline ? element.find("textarea") : element.find("input");
                inputElement[0].focus();
            });

            scope.focus = function() {
                scope.state.focused = true;
                element.toggleClass('phi-input-focused', true);
                scope.ngFocus();
            };

            scope.blur = function() {
                scope.state.focused = false;
                element.toggleClass('phi-input-focused', false);
                scope.ngBlur();
            };

            scope.resizeTextarea = function() {
                if (scope.multiline) {
                    var textarea = element.find("textarea");
                    textarea.css("height", "auto");
                    textarea.css("height", Math.max(textarea[0].scrollHeight, textarea[0].clientHeight) + "px");
                }
            };

            scope.$watch("ngModel", function(newValue, oldValue) {
                scope.state.empty = newValue == undefined || !newValue.length;
                element.toggleClass('phi-input-empty', scope.state.empty);

                if (newValue != oldValue) {
                    scope.resizeTextarea();
                    scope.ngChange();
                }
            });

        }

    };

}]);