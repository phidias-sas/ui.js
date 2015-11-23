(function() {
    'use strict';

    angular
        .module('phidias-ui')
        .filter('trustAsResourceUrl', trustAsResourceUrl)
        .filter('trustAsUrl', trustAsUrl);

    trustAsResourceUrl.$inject = ["$sce"];
    function trustAsResourceUrl($sce) {
        return $sce.trustAsResourceUrl;
    }

    trustAsUrl.$inject = ["$sce"];
    function trustAsUrl($sce) {
        return $sce.trustAsUrl;
    }

})();