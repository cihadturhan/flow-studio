(function (angular) {
    'use strict';

    angular
        .module('app.flow')
        .service('CollisionAvoidingManhattanRouter', CollisionAvoidingManhattanRouterService);

    CollisionAvoidingManhattanRouterService.$inject = ['CANVAS'];

    /* @ngInject */
    function CollisionAvoidingManhattanRouterService(CANVAS) {
        var vm = this;

        vm.create = create;

        ////////////////////////

        function create(attributes) {
            var router = draw2d.layout.connection.ConnectionRouter.extend({
                NAME: CANVAS.basic.router.collision_avoiding_manhattan_router,
                onInstall: function (connection) {
                    connection.installEditPolicy(new draw2d.policy.line.LineSelectionFeedbackPolicy());
                },
                route: function (conn, routingHints, index) {

                    var fromPt = conn.getStartPoint();
                    var fromDir = conn.getSource().getConnectionDirection(conn.getTarget());

                    var toPt = conn.getEndPoint();
                    var toDir = conn.getTarget().getConnectionDirection(conn.getSource());

                    // calculate the lines between the two points.
                    //
                    this._route(conn, toPt, toDir, fromPt, fromDir, index);
                    this._paint(conn);
                },
                _route: function (conn, fromPt, fromDir, toPt, toDir, index) {
                    var connSource = conn.getSource().getParent();
                    var connTarget = conn.getTarget().getParent();
                    // fromPt is an x,y to start from.
                    // fromDir is an angle that the first link must
                    var start = conn.getStartPoint();
                    var end = conn.getEndPoint();


                    var MINDIST, SEPARATION;
                    var multipier;
                    MINDIST = this.MINDIST;

                    if (typeof index === 'undefined' || !(fromPt.equals(conn.getEndPoint()) && toPt.equals(conn.getStartPoint()))) {

                        SEPARATION = 0;

                    } else if (index % 2 === 0) {
                        multipier = (index / 2) + 1;
                        SEPARATION = this.SEPARATION * multipier;
                        //MINDIST = this.MINDIST * index;
                    } else {
                        multipier = -(index + 1) / 2;
                        SEPARATION = this.SEPARATION * multipier;
                        //MINDIST = -this.MINDIST * index;
                    }


                    var UP = draw2d.geo.Rectangle.DIRECTION_UP;
                    var RIGHT = draw2d.geo.Rectangle.DIRECTION_RIGHT;
                    var DOWN = draw2d.geo.Rectangle.DIRECTION_DOWN;
                    var LEFT = draw2d.geo.Rectangle.DIRECTION_LEFT;

                    /*        var position = end.getPosition(start);
                            var isPositionNormal = position === draw2d.geo.PositionConstants.SOUTH || position === draw2d.geo.PositionConstants.EAST;
                            var ray;
                            if (isPositionNormal) {
                                ray = new draw2d.geo.Point(end.x - start.x, end.y - start.y);
                            } else {
                                ray = new draw2d.geo.Point(start.x - end.x, start.y - end.y);
                            }

                            var length = Math.sqrt(ray.x * ray.x + ray.y * ray.y);*/

                    var xDiff = fromPt.x - toPt.x;
                    var yDiff = fromPt.y - toPt.y;
                    var point;
                    var dir;
                    var pos;
                    var diff;

                    if (((xDiff * xDiff) < (this.TOLxTOL)) && ((yDiff * yDiff) < (this.TOLxTOL))) {
                        conn.addPoint(new draw2d.geo.Point(toPt.x, toPt.y));
                        return;
                    }

                    if (fromDir === LEFT) {
                        if ((xDiff > 0) && ((yDiff * yDiff) < this.TOL) && (toDir === RIGHT)) {
                            point = toPt;
                            dir = toDir;
                        }
                        else {
                            if (xDiff < 0) {
                                point = new draw2d.geo.Point(fromPt.x - MINDIST, fromPt.y);
                            }
                            else if (((yDiff > 0) && (toDir === DOWN)) || ((yDiff < 0) && (toDir === UP))) {
                                point = new draw2d.geo.Point(toPt.x, fromPt.y);
                            }
                            else if (fromDir == toDir) {
                                pos = Math.min(fromPt.x, toPt.x) - MINDIST;
                                point = new draw2d.geo.Point(pos, fromPt.y);
                            }
                            else if (Math.abs(xDiff) < Math.max(connSource.width, connTarget.width)) {
                                diff = Math.min(connTarget.x, connSource.x) - MINDIST;

                                /*tWidth = connTarget.width;
                                sWidth =  connSource.width;
                                if(connSource == connTarget){
                                    tWidth = 2*tWidth;
                                    sWidth = 2*sWidth;
                                }*/

                                point = new draw2d.geo.Point(diff, fromPt.y);
                            }
                            else {
                                point = new draw2d.geo.Point(fromPt.x - (xDiff / 2), fromPt.y);
                            }

                            if (yDiff > 0) {
                                dir = UP;
                            }
                            else {
                                dir = DOWN;
                            }
                        }
                    }
                    else if (fromDir === RIGHT) {
                        if ((xDiff < 0) && ((yDiff * yDiff) < this.TOL) && (toDir === LEFT)) {
                            point = toPt;
                            dir = toDir;
                        }
                        else {
                            if (xDiff > 0) {
                                point = new draw2d.geo.Point(fromPt.x + MINDIST, fromPt.y);
                            }
                            else if (((yDiff > 0) && (toDir === DOWN)) || ((yDiff < 0) && (toDir === UP))) {
                                point = new draw2d.geo.Point(toPt.x, fromPt.y);
                            }
                            else if (fromDir === toDir) {
                                pos = Math.max(fromPt.x, toPt.x) + MINDIST;
                                point = new draw2d.geo.Point(pos, fromPt.y);
                            } else if (Math.abs(xDiff) < Math.max(connSource.width, connTarget.width)) {
                                diff = Math.max(connTarget.x + connTarget.width, connSource.x + connSource.width) + MINDIST;
                                point = new draw2d.geo.Point(diff, fromPt.y);
                            }
                            else {
                                point = new draw2d.geo.Point(fromPt.x - (xDiff / 2), fromPt.y);
                            }

                            if (yDiff > 0) {
                                dir = UP;
                            }
                            else {
                                dir = DOWN;
                            }
                        }
                    }
                    else if (fromDir === DOWN) {
                        if (((xDiff * xDiff) < this.TOL) && (yDiff < 0) && (toDir === UP)) {
                            point = toPt;
                            dir = toDir;
                        }
                        else {
                            if (yDiff > 0) {
                                point = new draw2d.geo.Point(fromPt.x, fromPt.y + MINDIST);
                            }
                            else if (((xDiff > 0) && (toDir === RIGHT)) || ((xDiff < 0) && (toDir === LEFT))) {
                                point = new draw2d.geo.Point(fromPt.x, toPt.y);
                            }
                            else if (fromDir === toDir) {
                                pos = Math.max(fromPt.y, toPt.y) + MINDIST;
                                point = new draw2d.geo.Point(fromPt.x, pos);
                            }
                            else if (SEPARATION !== 0) {
                                point = new draw2d.geo.Point(fromPt.x + SEPARATION, fromPt.y);
                            } else {
                                point = new draw2d.geo.Point(fromPt.x, fromPt.y - (yDiff / 2));
                            }

                            if (SEPARATION === 0) {
                                if (xDiff > 0) {
                                    dir = LEFT;
                                }
                                else {
                                    dir = RIGHT;
                                }
                            } else {
                                dir = UP;
                            }
                        }
                    }
                    else if (fromDir === UP) {
                        if (((xDiff * xDiff) < this.TOL) && (yDiff > 0) && (toDir === DOWN)) {
                            point = toPt;
                            dir = toDir;
                        }
                        else {
                            if (yDiff < 0) {
                                point = new draw2d.geo.Point(fromPt.x, fromPt.y - MINDIST);
                            }
                            else if (((xDiff > 0) && (toDir === RIGHT)) || ((xDiff < 0) && (toDir === LEFT))) {
                                point = new draw2d.geo.Point(fromPt.x, toPt.y);
                            }
                            else if (fromDir === toDir) {
                                pos = Math.min(fromPt.y, toPt.y) - MINDIST;
                                point = new draw2d.geo.Point(fromPt.x, pos);
                            }
                            else if (SEPARATION !== 0) {
                                point = new draw2d.geo.Point(fromPt.x + SEPARATION, fromPt.y);
                            } else {
                                point = new draw2d.geo.Point(fromPt.x, fromPt.y - (yDiff / 2));
                            }

                            if (SEPARATION === 0) {
                                if (xDiff > 0) {
                                    dir = LEFT;
                                }
                                else {
                                    dir = RIGHT;
                                }
                            } else {
                                dir = UP;
                            }
                        }
                    }
                    this._route(conn, point, dir, toPt, toDir, index);
                    conn.addPoint(fromPt);
                },
            });

            vm.collision_avoiding_manhattan_router = new router(CANVAS.basic.router.collision_avoiding_manhattan_router.attr);


            if(attributes){
                vm.collision_avoiding_manhattan_router.setPersistentAttributes(attributes);
            }

            function setPersistentAttributes(memento) {
                var model = this;
                model._super(memento);
                model.resetChildren();
            }

            return vm.collision_avoiding_manhattan_router;
        }
    }
})(angular);