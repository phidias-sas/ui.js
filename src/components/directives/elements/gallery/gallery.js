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
                                   'phi-icon-left="fa-caret-left"' + 
                                   'ng-class="{disabled: !gallery.control.hasPrevious()}"' + 
                                   'ng-click="gallery.control.previous(); $event.stopPropagation();">' + 
                                   'anterior' + 
                                '</a>' + 

                                '<span>{{gallery.control.activeIndex+1}} de {{gallery.control.length}}</span>' + 

                                '<a class="next"' + 
                                   'phi-icon-right="fa-caret-right"' + 
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