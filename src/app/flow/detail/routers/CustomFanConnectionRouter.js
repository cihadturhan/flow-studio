(function (angular) {
    'use strict';

    angular
        .module('app.flow')
        .service('CustomFanRouter', CanvasFanRouterService);

    CanvasFanRouterService.$inject = ['CANVAS', 'CollisionAvoidingManhattanRouter'];

    /* @ngInject */
    function CanvasFanRouterService(CANVAS, CollisionAvoidingManhattanRouter) {
        var vm = this;

        vm.create = create;

        ////////////////////////

        function create() {

            var attr = CANVAS.basic.router.custom_fan_router.attr;
            attr.NAME = CANVAS.basic.router.custom_fan_router.config.name;

            vm.CanvasFanConnectionRouter = CollisionAvoidingManhattanRouter.create(attr);
            vm.CanvasFanConnectionRouter.onInstall = function (connection) {
                connection.installEditPolicy(new draw2d.policy.line.LineSelectionFeedbackPolicy());
            };

            vm.CanvasFanConnectionRouter.route = function (conn, routingHints) {
                var source = conn.getSource().getParent(), target = conn.getTarget().getParent();

                var position = target.getPosition().getPosition(source.getPosition());
                var isConnectionNormal = position === draw2d.geo.PositionConstants.SOUTH || position === draw2d.geo.PositionConstants.EAST;
                var lines;
                if (isConnectionNormal) {
                    lines = source.getConnections().clone();
                    lines.addAll(target.getConnections().clone(), true);
                } else {
                    lines = target.getConnections().clone();
                    lines.addAll(source.getConnections().clone(), true);
                }

                lines.grep(function (other) {
                    return other.getSource().getParent() === source && other.getTarget().getParent() === target ||
                        other.getTarget().getParent() === source && other.getSource().getParent() === target;
                });

                //Self connection
                if (source === target) {
                    //this._super(conn, routingHints, lines.indexOf(conn));
                    //return this._super(conn, routingHints);
                    return this.selfRouteCollision(conn, lines.indexOf(conn), lines.getSize());
                }

                if (lines.getSize() > 1) {

                    //this._super(conn, routingHints, lines.indexOf(conn));
                    this.routeCollision(conn, lines.indexOf(conn), lines.getSize());
                } else {
                    this._super(conn, routingHints);
                }
            };

            vm.CanvasFanConnectionRouter.selfRouteCollision = function (conn, index, length) {
                var start = new draw2d.geo.Point(conn.getStartX(), conn.getStartY());
                var end = new draw2d.geo.Point(conn.getEndX(), conn.getEndY());

                var startElbow0, endElbow0, endElbow1, endElbow2, startElbow1, startElbow2, multipier;
                var maxMultiplier = length % 2 === 0 ? length / 2 + 1 : (length + 1) / 2 + 1;

                if (index % 2 === 0) {
                    multipier = (index / 2) + 1;
                } else {
                    multipier = -(index + 1) / 2;
                }
                var SEPARATION = this.SEPARATION * multipier * 3 / 2;
                var EPS_X = (multipier > 0 ? 1 : -1) * (maxMultiplier - Math.abs(multipier)) * this.EPSILON;
                var EPS_Y = Math.abs(multipier) * this.EPSILON * 2;

                var x = multipier > 0 ? Math.max(start.x, end.x) + SEPARATION : Math.min(start.x, end.x) + SEPARATION;

                startElbow0 = new draw2d.geo.Point(start.x + EPS_X, start.y);
                startElbow1 = new draw2d.geo.Point(start.x + EPS_X, start.y + EPS_Y);
                startElbow2 = new draw2d.geo.Point(x, start.y + EPS_Y);
                endElbow2 = new draw2d.geo.Point(x, end.y - EPS_Y);
                endElbow1 = new draw2d.geo.Point(end.x + EPS_X, end.y - EPS_Y);
                endElbow0 = new draw2d.geo.Point(end.x + EPS_X, end.y);

                conn.addPoint(startElbow0);
                conn.addPoint(startElbow1);
                conn.addPoint(startElbow2);
                conn.addPoint(endElbow2);
                conn.addPoint(endElbow1);
                conn.addPoint(endElbow0);

                // calculate the path string for the SVG rendering
                //
                this._paint(conn);
            };

            vm.CanvasFanConnectionRouter.routeCollision = function (conn, index, length) {
                var start = conn.getStartPoint();
                var end = conn.getEndPoint();

                var startElbow0, endElbow0, endElbow1, endElbow2, startElbow1, startElbow2, multipier;
                var maxMultiplier = length % 2 === 0 ? length / 2 + 1 : (length + 1) / 2 + 1;


                if (index % 2 === 0) {
                    multipier = (index / 2) + 1;
                } else {
                    multipier = -(index + 1) / 2;
                }
                var SEPARATION = this.SEPARATION * multipier;
                var EPS_X = this.EPSILON * multipier;
                var EPS_Y = (maxMultiplier - Math.abs(multipier)) * this.EPSILON * 2;

                var x = multipier > 0 ? Math.max(start.x, end.x) + SEPARATION : Math.min(start.x, end.x) + SEPARATION;

                startElbow0 = new draw2d.geo.Point(start.x + EPS_X, start.y);
                startElbow1 = new draw2d.geo.Point(start.x + EPS_X, start.y + EPS_Y);
                startElbow2 = new draw2d.geo.Point(x, start.y + EPS_Y);
                endElbow2 = new draw2d.geo.Point(x, end.y - EPS_Y);
                endElbow1 = new draw2d.geo.Point(end.x + EPS_X, end.y - EPS_Y);
                endElbow0 = new draw2d.geo.Point(end.x + EPS_X, end.y);

                conn.addPoint(startElbow0);
                conn.addPoint(startElbow1);
                conn.addPoint(startElbow2);
                conn.addPoint(endElbow2);
                conn.addPoint(endElbow1);
                conn.addPoint(endElbow0);

                // calculate the path string for the SVG rendering
                //
                this._paint(conn);
            };

            return vm.CanvasFanConnectionRouter;

        }
    }
})(angular);