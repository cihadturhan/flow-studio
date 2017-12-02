/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.flow')
        .service('TimeLabelLocator', TimeLabelLocatorService);

    TimeLabelLocatorService.$inject = ['CANVAS'];

    /* @ngInject */
    function TimeLabelLocatorService(CANVAS) {
        var vm = this;

        vm.create = create;

        ////////////////////////

        function create() {
            var locator = draw2d.layout.locator.ManhattanMidpointLocator.extend({
                NAME: CANVAS.basic.locator.time_label_locator.config.name,
                relocate: relocate
                // rotate: rotate
            });

            return new locator();

            ///////////////////

            function relocate(index, target) {
                var conn = target.getParent();
                var points = conn.getVertices();
                var segmentIndex = Math.floor((points.getSize() - 2) / 2);
                if (points.getSize() <= segmentIndex + 1)
                    return;
                var p1 = points.get(segmentIndex);
                var p2 = points.get(segmentIndex + 1);
                var x = ((p2.x - p1.x) / 2 + p1.x - target.getWidth() / 2) | 0;
                var y = ((p2.y - p1.y) / 2 + p1.y - target.getHeight() / 2) | 0;
                target.setPosition(x, y);
            }

        }
    }
})(angular);