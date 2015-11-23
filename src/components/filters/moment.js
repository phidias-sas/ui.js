(function() {
    'use strict';

    angular
        .module("phidias-ui")
        .filter("momentCalendar", calendar)
        .filter("momentFromNow", fromNow);

    function calendar() {
        return function(timestamp) {
            return moment(timestamp*1000).calendar();
        };
    }

    function fromNow() {
        return function(timestamp) {
            return moment(timestamp*1000).fromNow();
        };
    }


})();