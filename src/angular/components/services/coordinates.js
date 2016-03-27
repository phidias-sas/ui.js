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