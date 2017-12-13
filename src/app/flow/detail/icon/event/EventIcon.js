/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.flow')
        .service('EventIcon', EventIconService);

    EventIconService.$inject = [
        '$injector',
        'CANVAS',
        'AutoFlowCanvasStory'
    ];

    /* @ngInject */
    function EventIconService($injector, CANVAS, AutoFlowCanvasStory) {
        var vm = this;

        vm.create = create;

        ////////////////////////

        function create(attributes){
            var event = draw2d.shape.icon.Icon.extend({
                NAME: CANVAS.icon.event.config.name,
                createSet: createSet,
                getPersistentAttributes: getPersistentAttributes,
                setPersistentAttributes: setPersistentAttributes
            });

            //
            var MyInputPortLocator = draw2d.layout.locator.PortLocator.extend({
                init:function( ){
                    this._super();
                },
                relocate:function(index, figure){
                    this.applyConsiderRotation(figure, figure.getParent().getWidth()/2, 0);
                }
            });


            var MyOutputPortLocator = draw2d.layout.locator.PortLocator.extend({
                init:function( ){
                    this._super();
                },
                relocate:function(index, figure){
                    var p = figure.getParent();

                    this.applyConsiderRotation(figure, p.getWidth()/2, p.getHeight());
                }
            });

            vm.event = new event(CANVAS.icon.event.attr);
            vm.event.createPort('input', MyInputPortLocator());
            vm.event.createPort('output', MyOutputPortLocator());

            if(attributes){
                vm.event.setPersistentAttributes(attributes);
            }
            return vm.event;

            ////////////////////////////////

            function createSet() {
                var x = ((this.width - 40) / 2);
                return vm.event.canvas.paper.image(CANVAS.icon.event.config.image, x, 16, 40, 40);
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
