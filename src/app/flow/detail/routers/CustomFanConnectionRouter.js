draw2d.layout.connection.CustomFanConnectionRouter = draw2d.layout.connection.DirectRouter.extend({
    NAME : "draw2d.layout.connection.CustomFanConnectionRouter",

    /**
     * @constructor Creates a new Router object.
     */
    init: function()
    {
        this._super();

    },


    /**
     * @method
     * Callback method if the router has been assigned to a connection.
     *
     * @param {draw2d.Connection} connection The assigned connection
     * @template
     * @since 2.7.2
     */
    onInstall: function(connection)
    {
        connection.installEditPolicy(new draw2d.policy.line.LineSelectionFeedbackPolicy());

    },

    /**
     * @method
     * Layout the hands over connection in a manhattan like layout
     *
     * @param {draw2d.Connection}  conn
     * @param {draw2d.util.ArrayList} oldVertices old/existing vertices of the Connection
     * @param {Object} routingHints some helper attributes for the router
     * @param {Boolean} routingHints.startMoved is true if just the start location has moved
     * @param {Boolean} routingHints.destMoved is true if the destination location has changed
     */
    route: function(conn, routingHints)
    {
        var lines = conn.getSource().getConnections().clone();
        var targetLines = conn.getTarget().getConnections().clone();
        lines.addAll(targetLines, true);

        lines.grep(function(other){
            return other.getTarget() === conn.getTarget() || other.getSource() === conn.getTarget();
        });

        if (lines.getSize() > 1){
            this.routeCollision(conn, lines.indexOf(conn));
        }
        else{
            this._super(conn, routingHints);
        }
    },

    /**
     * @method
     * route the connection if connections overlap. Two connections overlap if the combination
     * of source and target anchors are equal.
     *
     * @param {draw2d.Connection} conn
     * @param {Number} index
     */
    routeCollision: function(conn, index)
    {
        index = index+1;
        var start = conn.getStartPoint();
        var end = conn.getEndPoint();

        var separation = 90;

        var querterPoint = new draw2d.geo.Point((end.x + 3*start.x) / 4, (end.y + 3 * start.y) / 4);
        var thirdQuerterPoint = new draw2d.geo.Point((3 * end.x + start.x) / 4, (3 * end.y + start.y) / 4);
        var position = end.getPosition(start);
        var ray;
        if (position == draw2d.geo.PositionConstants.SOUTH || position == draw2d.geo.PositionConstants.EAST){
            ray = new draw2d.geo.Point(end.x - start.x, end.y - start.y);
        }
        else{
            ray = new draw2d.geo.Point(start.x - end.x, start.y - end.y);
        }

        var length = Math.sqrt(ray.x * ray.x + ray.y * ray.y);

        var xSeparation = separation * ray.x / length;
        var ySeparation = separation * ray.y / length;

        var bendPoint1, bendPoint2;

        if (index % 2 === 0){
            if (index !== 0) {
                index = index - 1;
            }
            bendPoint1 = new draw2d.geo.Point(querterPoint.x + (index / 2) * (-1 * ySeparation), querterPoint.y + (index / 2) * xSeparation);
            bendPoint2 =   new draw2d.geo.Point(thirdQuerterPoint.x + (index / 2) * (-1 * ySeparation), thirdQuerterPoint.y + (index / 2) * xSeparation);
        }
        else{
            bendPoint1 = new draw2d.geo.Point(querterPoint.x + (index / 2) * ySeparation, querterPoint.y + (index / 2) * (-1 * xSeparation));
            bendPoint2 = new draw2d.geo.Point(thirdQuerterPoint.x + (index / 2) * ySeparation, thirdQuerterPoint.y + (index / 2) * (-1 * xSeparation));
        }

        // required for hit tests
        conn.addPoint(start);
        conn.addPoint(bendPoint1);
        conn.addPoint(bendPoint2);
        conn.addPoint(end);

        // calculate the path string for the SVG rendering
        //
        this._paint(conn);
    }

});