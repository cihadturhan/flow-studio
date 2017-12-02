/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.flow')
        .controller('FlowDetailController', FlowDetailController);


    FlowDetailController.$inject = [
        '$scope',
        '$window',
        'CANVAS',
        'AutoFlowCanvasDraw'
    ];

    /* @ngInject */
    function FlowDetailController($scope, $window, CANVAS, AutoFlowCanvasDraw) {
        var vm = this;

        vm.canvasId = CANVAS.canvas.id;

        vm.save = save;
        vm.cancel = cancel;
        vm.draft = draft;
        vm.exportCanvas = exportCanvas;
        vm.undo = AutoFlowCanvasDraw.undo;
        vm.redo = AutoFlowCanvasDraw.redo;
        vm.resizeCanvas = resizeCanvas;
        vm.resizePalette = resizePalette;

        activate();

        var w = angular.element($window);

        function resizeCanvas() {
            // there are padding, margin etc, hence it is added 20 more px
            var otherElementsHeight = 0;
            if (angular.element(".header-page")[0]) {
                otherElementsHeight += angular.element(".header-page")[0].offsetHeight;
            } else {
                otherElementsHeight += 60;
            }
            if (angular.element(".main-header")[0]) {
                otherElementsHeight += angular.element(".main-header")[0].offsetHeight;
            } else {
                otherElementsHeight += 60;
            }
            otherElementsHeight += angular.element(".navbar-default")[0].offsetHeight + 30;
            var height = w.height() - otherElementsHeight;
            return {
                'height': (height) + 'px', 'width': 'auto'
            };
        }

        function resizePalette() {
            // there are padding, margin etc, hence it is added 20 more px
            var otherElementsHeight = 0;
            if (angular.element(".header-page")[0]) {
                otherElementsHeight += angular.element(".header-page")[0].offsetHeight;
            } else {
                otherElementsHeight += 60;
            }
            if (angular.element(".main-header")[0]) {
                otherElementsHeight += angular.element(".main-header")[0].offsetHeight;
            } else {
                otherElementsHeight += 60;
            }
            otherElementsHeight += angular.element(".navbar-default")[0].offsetHeight + angular.element(".first-palette")[0].offsetHeight - 18;
            return {
                'height': (w.height() - otherElementsHeight) + 'px'
            };


        }

        w.bind('resize', function () {
            $scope.$apply();
        });


        function activate() {
            vm.editor = {
                canvas: {},
                palette: [
                    {
                        'class': "StepIcon",
                        'name': "flow.icon.step.title"
                    }
                ]
            };
        }

        function save() {
        }

        function draft() {
        }

        function cancel() {
        }

        function exportCanvas() {
            AutoFlowCanvasDraw.exportAsJson();
        }


    }

})(angular);
