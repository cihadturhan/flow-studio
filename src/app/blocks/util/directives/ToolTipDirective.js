(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .directive('showTooltipOnTextOverflow', showTooltipOnTextOverflow);


    showTooltipOnTextOverflow.$inject = ['$timeout'];

    function showTooltipOnTextOverflow($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var el = element[0];
                scope.$watch(function () {
                    return el.scrollWidth;
                }, function () {
                    var el = element[0];
                    if (el.offsetWidth < el.scrollWidth) {
                        attrs.tooltipEnable = "true";
                    }
                });
                $timeout(function () {
                    var el = element[0];
                    if (el.offsetWidth < el.scrollWidth) {
                        attrs.tooltipEnable = "true";
                    }
                });
            }
        };
    }
})(angular);