/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.flow')
        .service('RuleMiniIcon', RuleMiniIconService);

    RuleMiniIconService.$inject = [
        '$injector',
        'CANVAS'
    ];

    /* @ngInject */
    function RuleMiniIconService($injector, CANVAS) {
        var vm = this;

        vm.create = create;

        ////////////////////////

        function create(attributes){
            vm.canvas = $injector.get('AutoFlowCanvasDraw').canvas;

            var rule = draw2d.shape.icon.Icon.extend({
                NAME: CANVAS.icon.rule_mini.config.name,
                createSet: createSet,
                onDoubleClick: onDoubleClick,
                getPersistentAttributes: getPersistentAttributes,
                setPersistentAttributes: setPersistentAttributes
            });

            vm.rule = new rule(CANVAS.icon.rule_mini.attr);

            if(attributes){
                vm.rule.setPersistentAttributes(attributes);
            }
            return vm.rule;

            ////////////////

            function onDoubleClick(){
                var model = this;
                model.parent.createRuleConnection();
            }

            function createSet() {
                var x = ((this.width - 40) / 2);
                return $injector.get('AutoFlowCanvasDraw').canvas.paper.image(CANVAS.icon.rule_mini.config.image, x, 16, 40, 40);
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
