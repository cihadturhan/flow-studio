/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.flow')
        .directive('autoflowPalette', autoflowPalette);

    autoflowPalette.$inject = ['$timeout'];
    /* @ngInject */
    function autoflowPalette($timeout) {
        return {
            restrict: 'E,A',
            link: function (scope, element, attrs, controller) {
                $timeout(function () {
                    $(".draw2d_droppable").draggable({
                        appendTo: "body",
                        stack: "body",
                        scroll: false,
                        zIndex: 27000,
                        helper: "clone",
                        drag: function (event, ui) {
                        },
                        stop: function (e, ui) {
                        },
                        start: function (e, ui) {
                            $(ui.helper).addClass("shadow");
                        }
                    });
                }, 0);
            },
            templateUrl: 'app/flow/detail/directives/AutoFlowPaletteView.html'
        };
    }
})(angular);
