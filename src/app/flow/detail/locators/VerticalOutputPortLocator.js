(function (angular) {
    'use strict';

    angular
        .module('app.flow')
        .service('VerticalOutputPortLocator', VerticalOutputPortLocatorService);

    VerticalOutputPortLocatorService.$inject = ['CANVAS'];

    /* @ngInject */
    function VerticalOutputPortLocatorService(CANVAS) {
        var vm = this;

        vm.create = create;

        ////////////////////////

        function create() {
            var locator = draw2d.layout.locator.PortLocator.extend({
                NAME: CANVAS.basic.locator.vertical_output_port_locator,
                init: function () {
                    this._super();
                },
                relocate: function (index, figure) {
                    var p = figure.getParent();

                    this.applyConsiderRotation(figure, p.getWidth() / 2, p.getHeight());
                }
            });

            vm.VerticalOutputPortLocator = new locator();
            return vm.VerticalOutputPortLocator;
        }
    }
})(angular);