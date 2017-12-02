/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.flow')
        .service('StepLabel', StepLabelService);

    StepLabelService.$inject = [
        'CANVAS'
    ];

    /* @ngInject */
    function StepLabelService(CANVAS) {
        var vm = this;

        vm.create = create;

        ////////////////////////

        function create(){
            var event = draw2d.shape.basic.Label.extend({
                NAME: CANVAS.basic.label.step_label.config.name,
                onDoubleClick: onDoubleClick
            });

            vm.event = angular.extend(new event(CANVAS.basic.label.step_label.attr), {});

            return vm.event;

            function onDoubleClick(){
                this.getParent().onDoubleClick();
            }

        }
    }
})(angular);