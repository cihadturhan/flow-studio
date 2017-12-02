/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';
    angular
        .module('app.flow')
        .directive('autoFlowCanvas', autoFlowCanvas);

    autoFlowCanvas.$inject = ['AutoFlowCanvasDraw', 'AutoFlowCanvasStory'];
    /* @ngInject */
    function autoFlowCanvas(AutoFlowCanvasDraw, AutoFlowCanvasStory) {
        return {
            restrict: 'A',
            scope: {
              ngModel: '='
            },
            link: function (scope, element) {
                var canvas = AutoFlowCanvasDraw.create({
                    element: element
                });

                /**
                 * Watch model of canvas
                 * If It has data, this data will be preview on canvas
                 */
                scope.$watch('ngModel', function (newVal, oldValue) {
                    if(!scope.preventWatch && newVal && newVal.storyTemplateDiagram && newVal.storyTemplate){
                        scope.preventWatch = true;
                        AutoFlowCanvasDraw.loadFlow(newVal.storyTemplateDiagram);
                        AutoFlowCanvasStory.story.storyTemplate = newVal.storyTemplate;

                    }
                    return scope.ngModel;
                }, true);
            }
        };
    }

})(angular);

