/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.flow')
        .service('TimeHorizontalLayout', TimeHorizontalLayoutService);

    TimeHorizontalLayoutService.$inject = [
        '$injector',
        'CANVAS'
    ];

    /* @ngInject */
    function TimeHorizontalLayoutService($injector, CANVAS) {
        var vm = this;

        vm.create = create;

        ////////////////////////

        function create(attributes) {
            var layout = draw2d.shape.layout.HorizontalLayout.extend({
                NAME: CANVAS.basic.layout.time_horizontal_layout.config.name,
                getPersistentAttributes: getPersistentAttributes,
                setPersistentAttributes: setPersistentAttributes
            });

            vm.layout = new layout(CANVAS.basic.layout.time_horizontal_layout.attr);
            if (attributes) {
                vm.layout.setPersistentAttributes(attributes);
            }
            return vm.layout;

            ///////////////////

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

                function onIterateLabel(item) {
                    var figure;
                    if (item.type === "draw2d.shape.basic.Image") {
                        figure = new draw2d.shape.basic.Image({
                            path: CANVAS.icon.time_mini.config.image,
                            cssClass: CANVAS.icon.time_mini.attr.cssClass,
                            width: 22,
                            height: 22,
                            resizeable: false
                        });
                    } else {

                        figure = $injector.get('AutoFlowCanvasDraw').createExistedItem(item);
                        figure.attr(item);
                    }
                    model.add(figure);
                }
            }
        }
    }
})(angular);