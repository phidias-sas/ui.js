(function() {
    'use strict';

    angular
        .module("phidias-ui", ["ngAria"]);

})();
(function() {
    'use strict';

    angular
        .module('phidias-ui')
        .service('phiCoordinates', phiCoordinates);

    phiCoordinates.$inject = ['$timeout'];
    function phiCoordinates($timeout) {

        return {

            /*
            Based on angular-material util.js
            https://github.com/angular/material/blob/master/src/core/util/util.js

            Return the bounding rectangle relative to the offset parent (nearest in the containment hierarchy positioned containing element)

            Caches results every 500ms, so it's safe to call it continuously (like inside a window.scroll event)

            */
            getBounds: function(element, offsetParent) {

                $timeout.cancel(element.clearBoundsTimeout);

                element.clearBoundsTimeout = $timeout(function() {
                    element.data('phi-coordinates-bounds', null);
                }, 500);

                var bounds = element.data('phi-coordinates-bounds');

                if (!bounds) {
                    var node       = element[0];
                    offsetParent   = offsetParent || node.offsetParent || document.body;
                    offsetParent   = offsetParent[0] || offsetParent;
                    var nodeRect   = node.getBoundingClientRect();
                    var parentRect = offsetParent.getBoundingClientRect();

                    bounds = {
                        left:   nodeRect.left - parentRect.left,
                        top:    nodeRect.top - parentRect.top,
                        width:  nodeRect.width,
                        height: nodeRect.height,
                        bottom: nodeRect.top - parentRect.top + nodeRect.height
                    };

                    element.data('phi-coordinates-bounds', bounds);
                }

                return bounds;

            },


            parseAlignmentString: function(string) {

                if (string == undefined) {
                    return null;
                }

                var vertical   = null;
                var horizontal = null;

                if (string.indexOf('center') != -1) {
                    vertical   = 'center';
                    horizontal = 'center';
                }

                if (string.indexOf('top') != -1) {
                    vertical = 'top';
                }

                if (string.indexOf('bottom') != -1) {
                    vertical = 'bottom';
                }

                if (string.indexOf('left') != -1) {
                    horizontal = 'left';
                }

                if (string.indexOf('right') != -1) {
                    horizontal = 'right';
                }

                if (!vertical || !horizontal) {
                    return null;
                }

                return {
                    vertical: vertical,
                    horizontal: horizontal
                };

            }

        };

    }

})();
/*
The phi-modal attribute only moves the element to the bottom of the body.
visibility can be established with the phi-visible attribute, and styling
is entirely up to the document
*/

(function() {
    'use strict';

    angular
        .module("phidias-ui")
        .directive("phiModal", phiModal);

    phiModal.$inject = ["$document"];
    function phiModal($document) {

        return {
            restrict: "A",

            link: function(scope, element, attributes)  {

                angular.element($document[0].body).append(element);

                scope.$on("$destroy", function() {
                    element.remove();
                });

            }
        };        
    };

})();
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

angular.module("phidias-ui").directive("phiCutout", [function() {

    return {
        restrict: "C",
        link: function(scope, element, attributes)  {
            element.prepend(angular.element('<div class="phi-cutout-ridge"><div></div><div></div><div></div></div>'));
        }
    };

}]);
(function() {
    'use strict';

    angular.module("phidias-ui")
        .directive('phiAvatar', phiAvatar);


    function phiAvatar() {

        return {
            restrict: 'E',
            template:

                '<div>' +
                    '<img ng-src="{{src}}" />' +
                '</div>',

            scope: {
                src: "@"
            }

        };

    };

})();
(function() {
    'use strict';

    angular
        .module("phidias-ui")
        .directive("phiButton", phiButtonDirective);


    function phiButtonDirective() {

        return {
            restrict:   "E",
            transclude: true,
            template:   "<button phi-button ng-transclude></button>",
            replace:    true
        }

    }

})();
/**
 * Proof of concept: Port an angular-material element
 */

(function() {
'use strict';

/**
 * @ngdoc module
 * @name material.components.checkbox
 * @description Checkbox module!
 */
angular.module("phidias-ui")
    .directive('phiCheckbox', ['inputDirective', MdCheckboxDirective]);

/**
 * @ngdoc directive
 * @name mdCheckbox
 * @module material.components.checkbox
 * @restrict E
 *
 * @description
 * The checkbox directive is used like the normal [angular checkbox](https://docs.angularjs.org/api/ng/input/input%5Bcheckbox%5D).
 *
 * As per the [material design spec](http://www.google.com/design/spec/style/color.html#color-ui-color-application)
 * the checkbox is in the accent color by default. The primary color palette may be used with
 * the `phi-primary` class.
 *
 * @param {string} ng-model Assignable angular expression to data-bind to.
 * @param {string=} name Property name of the form under which the control is published.
 * @param {expression=} ng-true-value The value to which the expression should be set when selected.
 * @param {expression=} ng-false-value The value to which the expression should be set when not selected.
 * @param {string=} ng-change Angular expression to be executed when input changes due to user interaction with the input element.
 * @param {boolean=} phi-no-ink Use of attribute indicates use of ripple ink effects
 * @param {string=} aria-label Adds label to checkbox for accessibility.
 * Defaults to checkbox's text. If no default text is found, a warning will be logged.
 *
 * @usage
 * <hljs lang="html">
 * <phi-checkbox ng-model="isChecked" aria-label="Finished?">
 *     Finished ?
 * </phi-checkbox>
 *
 * <phi-checkbox phi-no-ink ng-model="hasInk" aria-label="No Ink Effects">
 *     No Ink Effects
 * </phi-checkbox>
 *
 * <phi-checkbox ng-disabled="true" ng-model="isDisabled" aria-label="Disabled">
 *     Disabled
 * </phi-checkbox>
 *
 * </hljs>
 *
 */
function MdCheckboxDirective(inputDirective) {

    inputDirective = inputDirective[0];
    var CHECKED_CSS = 'phi-checked';

    return {
        restrict: 'E',
        transclude: true,
        require: '?ngModel',

        template:   '<div class="phi-checkbox-box"></div>' +
                    '<div ng-transclude class="phi-checkbox-label"></div>',

        compile: compile
    };

    // **********************************************************
    // Private Methods
    // **********************************************************

    function compile (tElement, tAttrs) {

        tAttrs.type     = 'checkbox';
        tAttrs.tabIndex = 0;
        tElement.attr('role', tAttrs.type);

        return function postLink(scope, element, attr, ngModelCtrl) {

            var checked = false;

            // Reuse the original input[type=checkbox] directive from Angular core.
            // This is a bit hacky as we need our own event listener and own render
            // function.
            inputDirective.link.pre(scope, {
                on: angular.noop,
                0: {}
            }, attr, [ngModelCtrl]);

            element.on('click', listener)
                   .on('keypress', keypressHandler);

            ngModelCtrl.$render = render;

            function keypressHandler(ev) {
                if(ev.which === 32) {
                    ev.preventDefault();
                    listener(ev);
                }
            }

            function listener(ev) {
                if (element[0].hasAttribute('disabled')) return;

                scope.$apply(function() {
                    checked = !checked;
                    ngModelCtrl.$setViewValue(checked, ev && ev.type);
                    ngModelCtrl.$render();
                });
            }

            function render() {
                checked = ngModelCtrl.$viewValue;
                element.toggleClass(CHECKED_CSS, checked);
            }
        };
    }
}

})();
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
(function() {
    'use strict';

    angular.module("phidias-ui")
        .directive("phiGallery", phiGallery)
        .directive("phiGalleryImage", phiGalleryImage);

    function phiGallery() {

        return {
            restrict: 'E',

            transclude: true,
            scope: true,

            template: '<ul class="phi-gallery-thumbnails" ng-transclude></ul>' +

                      '<div phi-modal class="phi-gallery-modal" phi-visible="{{gallery.modalShown}}" ng-click="gallery.modalShown = false">' +

                          '<div class="phi-gallery-modal-navigation">' +
                                '<a class="previous"' +
                                   'ng-class="{disabled: !gallery.control.hasPrevious()}"' +
                                   'ng-click="gallery.control.previous(); $event.stopPropagation();">' +
                                   'anterior' +
                                '</a>' +

                                '<span>{{gallery.control.activeIndex+1}} de {{gallery.control.length}}</span>' +

                                '<a class="next"' +
                                   'ng-class="{disabled: !gallery.control.hasNext()}"' +
                                   'ng-click="gallery.control.next(); $event.stopPropagation();">' +
                                   'siguiente' +
                                '</a>' +
                          '</div>' +

                          '<div class="phi-gallery-modal-contents" phi-switch="gallery.control">' +
                                '<div ng-repeat="image in gallery.images">' +
                                    '<img ng-src="{{image.src}}" />' +
                                    '<p ng-bind="image.description"></p>' +
                                '</div>' +
                          '</div>' +
                      '</div>',

            controller:   phiGalleryController,
            controllerAs: "gallery"

        };

    };


    phiGalleryController.$inject = ["$scope"];
    function phiGalleryController($scope) {

        var imageCount = 0;

        var gallery = this;

        gallery.control  = null;

        gallery.title    = "foo";
        gallery.images   = [];
        gallery.addImage = addImage;

        gallery.modalShown = false;

        function addImage(galleryImage, element) {

            galleryImage.key = imageCount++;

            gallery.images.push(galleryImage);

            element.on("click", function() {
                // !!! For some reason, the following code causes an error when minified
                $scope.$apply(function() {
                    gallery.control.select(galleryImage.key);
                    gallery.modalShown = true;
                });
            });
        }

    };


    function phiGalleryImage() {

        return {
            restrict: 'E',
            require: '^phiGallery',
            template: '<li><img ng-src="{{thumbnail}}" alt="{{alt}}" /></li>',
            replace: true,

            scope: {
                "thumbnail": "@",
                "alt":       "@"
            },

            link: function(scope, element, attributes, phiGallery) {

                var galleryImage = {
                    src:         attributes.src,
                    thumbnail:   attributes.thumbnail
                };

                phiGallery.addImage(galleryImage, element);

            }
        };

    };

})();
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

/**
* The ng-thumb directive
* @author: nerv
* @version: 0.1.2, 2014-01-09
*/
angular.module("phidias-ui").directive('ngThumb', ['$window', function($window) {

    var helper = {
        support: !!($window.FileReader && $window.CanvasRenderingContext2D),
        isFile: function(item) {
            return angular.isObject(item) && item instanceof $window.File;
        },
        isImage: function(file) {
            var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    };

    return {
        restrict: 'A',
        template: '<canvas/>',
        link: function(scope, element, attributes) {
            if (!helper.support) return;

            var params = scope.$eval(attributes.ngThumb);

            if (!helper.isFile(params.file)) return;
            if (!helper.isImage(params.file)) return;

            var canvas = element.find('canvas');
            var reader = new FileReader();

            reader.onload = onLoadFile;
            reader.readAsDataURL(params.file);

            function onLoadFile(event) {
                var img = new Image();
                img.onload = onLoadImage;
                img.src = event.target.result;
            }

            function onLoadImage() {
                var width = params.width || this.width / this.height * params.height;
                var height = params.height || this.height / this.width * params.width;
                canvas.attr({ width: width, height: height });
                canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
            }
        }
    };

}]);
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
/* Based on http://www.bennadel.com/blog/2756-experimenting-with-ngmodel-and-ngmodelcontroller-in-angularjs.htm */

(function() {
    'use strict';

    angular
        .module("phidias-ui")
        .directive("phiSelect", phiSelect)
        .directive("phiOption", phiOption);

    function phiSelect() {

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

    }

    var phiSelectLinkCounter = 0;
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

    }


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

    }


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

    }

})();
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
/*
Creates a containing element tinted with the given hue

<div phi-color-tint="[hue]">
*/

(function() {
    'use strict';

    angular
        .module("phidias-ui")
        .directive("phiColorTint", phiColorTint);


    function phiColorTint() {

        return {
            restrict: "A",
            // template: '<div class="phi-color-tint phi-color-background-{{hue}}" ng-transclude></div>',
            // transclude: true,

            link: function(scope, element, attributes) {
                var hue   = attributes.phiColorTint;
                var theme = attributes.phiColorTheme;
                element.prepend('<div phi-color-theme="'+theme+'" class="phi-color-tint phi-color-background-'+hue+'" />');
            }
        };
    };

})();