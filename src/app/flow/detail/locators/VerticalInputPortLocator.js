(function (angular) {
    'use strict';

    angular
        .module('app.flow')
        .service('VerticalInputPortLocator', VerticalInputPortLocatorService);

    VerticalInputPortLocatorService.$inject = ['CANVAS'];

    /* @ngInject */
    function VerticalInputPortLocatorService(CANVAS) {
        var vm = this;

        vm.create = create;

        ////////////////////////

        function create() {

            var locator = draw2d.layout.locator.PortLocator.extend({
                NAME: CANVAS.basic.locator.vertical_input_port_locator,
                init: function () {
                    this._super();
                },
                relocate: function (index, figure) {
                    this.applyConsiderRotation(figure, figure.getParent().getWidth() / 2, 0);
                }
            });

            vm.VerticalInputPortLocator = new locator();
            return vm.VerticalInputPortLocator;
        }
    }
})(angular);