/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.flow')
        .service('RuleConnection', RuleConnectionService);

    RuleConnectionService.$inject = [
        '$injector',
        'CANVAS',
        'CustomFanRouter'
    ];

    /* @ngInject */
    function RuleConnectionService($injector, CANVAS, CustomFanRouter) {
        var vm = this;

        vm.create = create;

        ////////////////////////

        function create(attributes, extras){
            var connection = draw2d.Connection.extend({
                NAME: CANVAS.basic.connection.rule_connection.config.name,
                // setTarget: setTarget,
                // setSource: setSource,
                getTargetStep: getTargetStep,
                getPersistentAttributes: getPersistentAttributes,
                setPersistentAttributes: setPersistentAttributes
            });

            vm.connection = new connection(angular.extend({}, CANVAS.basic.connection.rule_connection.attr));
            if(extras && extras.target){
                vm.connection.setTarget(extras.target);
                vm.connection.setSource(extras.source);
            }
            vm.connection.setRouter(CustomFanRouter);
            vm.connection.setTargetDecorator(new draw2d.decoration.connection.ArrowDecorator(8, 8));

            if (attributes) {
                vm.connection.setPersistentAttributes(attributes);
                angular.forEach(vm.connection.getSource().getParent().getConnections().data, onIterateConnection);
            }

            ///////////////

            function onIterateConnection(connection) {
                if (connection.NAME == CANVAS.basic.connection.event_connection.config.name) {
                    connection.setTargetDecorator(null);
                }
            }
            return vm.connection;

            /////////////////////////

            function setTarget(port){
                if (this.targetPort !== null) {
                    this.targetPort.off(this.moveListener);
                    this.targetPort.connections.remove(this);
                    this.targetPort.fireEvent("disconnect", {port: this.targetPort, connection: this});
                    // it is possible that a connection has already a port but is not assigned to
                    // a canvas. In this case we must check if the canvas set correct before we fire this event
                    if (this.canvas !== null) {
                        this.canvas.fireEvent("disconnect", {"port": this.targetPort, "connection": this});
                    }
                    this.targetPort.onDisconnect(this);
                }

                this.targetPort = port;
                if (this.targetPort === null) {
                    return;
                }

                this.routingRequired = true;
                this.fireTargetPortRouteEvent();
                this.targetPort.connections.add(this);
                this.targetPort.on("move", this.moveListener);
                if (this.canvas !== null) {
                    this.canvas.fireEvent("connect", {"port": this.targetPort, "connection": this});
                }
                this.setEndPoint(port.getAbsoluteX(), port.getAbsoluteY());

                if (this.sourcePort) {
                    this.targetPort.onConnect(this);
                    this.targetPort.fireEvent("connect", {port: this.targetPort, connection: this});
                    this.fireEvent("connect", {"port": this.targetPort, "connection": this});
                }

            }

            function setSource(port){
                if(this.sourcePort!==null){
                    this.sourcePort.off(this.moveListener);
                    this.sourcePort.connections.remove(this);
                    this.sourcePort.fireEvent("disconnect", {port: this.sourcePort, connection:this});
                    // it is possible that a connection has already a port but is not assigned to
                    // a canvas. In this case we must check if the canvas set correct before we fire this event
                    if(this.canvas!==null){
                        this.canvas.fireEvent("disconnect", {"port": this.sourcePort, "connection":this});
                    }
                    this.sourcePort.onDisconnect(this);
                }

                this.sourcePort = port;
                if(this.sourcePort===null){
                    return;
                }

                this.routingRequired = true;
                this.fireSourcePortRouteEvent();
                this.sourcePort.connections.add(this);
                this.sourcePort.on("move",this.moveListener);
                if(this.canvas!==null){
                    this.canvas.fireEvent("connect", {"port":this.sourcePort, "connection":this});
                }

                this.setStartPoint(port.getAbsoluteX(), port.getAbsoluteY());

                if (this.targetPort) {
                    this.sourcePort.onConnect(this);
                    this.sourcePort.fireEvent("connect", {port: this.sourcePort, connection:this});
                    this.fireEvent("connect", {"port":this.sourcePort, "connection":this});
                }
            }

            function getTargetStep(){
                return this.getTarget().getParent().getUserData();
            }

            function getPersistentAttributes() {
                var memento = this._super();

                memento.labels = [];
                this.children.each(function (i, e) {
                    var labelJSON = e.figure.getPersistentAttributes();
                    labelJSON.locator = e.locator.NAME;
                    memento.labels.push(labelJSON);
                });

                return memento;
            }

            function setPersistentAttributes(memento) {
                var model = this;

                vm.canvas = $injector.get('AutoFlowCanvasDraw').canvas;

                var node = vm.canvas.getFigure(memento.source.node);
                model.setSource(node.getPort(memento.source.port));

                var node = vm.canvas.getFigure(memento.target.node);
                model.setTarget(node.getPort(memento.target.port));


                model._super(memento);
                model.resetChildren();
                angular.forEach(memento.labels, onIterateLabel);

                /////////////////////

                function onIterateLabel(item){
                    var figure = $injector.get('AutoFlowCanvasDraw').createExistedItem(item);
                    figure.attr(item);
                    var locator = $injector.get('AutoFlowCanvasDraw').createExistedItem(item.locator, item.x - item.width, item.y);
                    model.add(figure, locator);
                }
            }
        }
    }
})(angular);