/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.flow')
        .service('EventLocator', EventLocatorService);

    EventLocatorService.$inject = ['CANVAS'];

    /* @ngInject */
    function EventLocatorService(CANVAS) {
        var vm = this;

        vm.create = create;

        ////////////////////////

        function create(){
            var locator = draw2d.layout.locator.ManhattanMidpointLocator.extend({
                NAME: CANVAS.basic.locator.event_locator.config.name,
                relocate: relocate
                // rotate: rotate
            });

            return new locator();

            ///////////////////

            //
            // function relocate(index, target) {
            //     var distanceFromConnection = -5;
            //     var conn = target.getParent();
            //     var points = conn.getVertices();
            //
            //     var segmentIndex = Math.floor((points.getSize() - 2) / 2.5);
            //     if (points.getSize() <= segmentIndex + 1) {
            //         return;
            //     }
            //
            //     var p1 = points.get(segmentIndex);
            //     var p2 = points.get(segmentIndex + 1);
            //
            //     // calculate the distance of the label (above or below the connection)
            //     var distance = distanceFromConnection <= 0 ? distanceFromConnection - target.getHeight() : distanceFromConnection;
            //
            //     // get the angle of the segment
            //     var nx = p1.x - p2.x;
            //     var ny = p1.y - p2.y;
            //     var length = Math.sqrt(nx * nx + ny * ny);
            //     var radian = -Math.asin(ny / length);
            //     var angle = (180 / Math.PI) * radian;
            //     if (radian < 0) {
            //         if (p2.x < p1.x) {
            //             radian = Math.abs(radian) + Math.PI;
            //             angle = 360 - angle;
            //             distance = -distance - target.getHeight();
            //         }
            //         else {
            //             radian = Math.PI * 2 - Math.abs(radian);
            //             angle = 360 + angle;
            //         }
            //     }
            //     else {
            //         if (p2.x < p1.x) {
            //             radian = Math.PI - radian;
            //             angle = 360 - angle;
            //             distance = -distance - target.getHeight();
            //         }
            //     }
            //
            //     var rotAnchor = this.rotate(length / 2.75 - target.getWidth() / 2, distance, 0, 0, radian);
            //
            //     // rotate the x/y coordinate with the calculated angle around "p1"
            //     //
            //     var rotCenterOfLabel = this.rotate(0, 0, target.getWidth() / 2, target.getHeight() / 2, radian);
            //
            //     target.setRotationAngle(angle);
            //     target.setPosition(rotAnchor.x - rotCenterOfLabel.x + p1.x, rotAnchor.y - rotCenterOfLabel.y + p1.y);
            // }
            //
            // function rotate(x, y, xm, ym, radian) {
            //     var cos = Math.cos,
            //         sin = Math.sin;
            //
            //     // Subtract midpoints, so that midpoint is translated to origin
            //     // and add it in the end again
            //     return {
            //         x: (x - xm) * cos(radian) - (y - ym) * sin(radian) + xm,
            //         y: (x - xm) * sin(radian) + (y - ym) * cos(radian) + ym
            //     };
            // }

            function relocate(index, target)
            {
                var conn = target.getParent();
                var points = conn.getVertices();

                var segmentIndex = Math.floor((points.getSize() -2) / 2);
                if (points.getSize() <= segmentIndex+1)
                    return;

                var p1 = points.get(segmentIndex);
                var p2 = points.get(segmentIndex + 1);

                var x = ((p2.x - p1.x) / 2 + p1.x - target.getWidth()/2) - 15;
                var y = ((p2.y - p1.y) / 2 + p1.y - target.getHeight()/2)|0;

                target.setPosition(x,y);
            }

        }
    }
})(angular);