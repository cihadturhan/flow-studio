/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.flow')
        .service('StartStepIcon', StartStepIconService);

    StartStepIconService.$inject = [
        '$injector',
        'CANVAS',
        'EventConnection',
        'AutoFlowCanvasStory',
        'VerticalInputPortLocator',
        'VerticalOutputPortLocator'
    ];
    /* @ngInject */
    function StartStepIconService($injector, CANVAS, EventConnection, AutoFlowCanvasStory, VerticalInputPortLocator,VerticalOutputPortLocator) {
        var vm = this;

        vm.create = create;

        ////////////////////////

        function create(x, y, attributes){
            vm.canvas = $injector.get('AutoFlowCanvasDraw').canvas;

            var startStep = draw2d.shape.basic.Rectangle.extend({
                NAME: CANVAS.icon.start_step.config.name,
                onMouseEnter: onMouseEnter,
                onMouseLeave: onMouseLeave,
                showTooltip: showTooltip,
                hideTooltip: hideTooltip
            });

            vm.startStep = new startStep(CANVAS.icon.start_step.attr);
            vm.startStep.createPort("input", VerticalInputPortLocator.create());
            vm.startStep.createPort("output", VerticalOutputPortLocator.create());


            if (attributes) {
                vm.startStep.setPersistentAttributes(attributes);
            } else {
                vm.startStep.userData = {name: "Start"};

                AutoFlowCanvasStory.story.storyTemplate.storyDefinition.steps.push(
                    {
                        name: "Start",
                        type: "Start",
                        actions: [],
                        maxVisitCount: 0
                    }
                )
            }

            vm.startStep.getOutputPorts().data[0].onMouseEnter = onOutputPortMouseEnter;
            vm.startStep.installEditPolicy(new draw2d.policy.figure.GlowSelectionFeedbackPolicy());
            vm.canvas.getCommandStack().execute(new draw2d.command.CommandAdd(vm.canvas, vm.startStep, x, y));
            /*vm.startStep.getOutputPorts().data[0].setConnectionAnchor(new draw2d.layout.anchor.ChopboxConnectionAnchor(vm.startStep.getOutputPorts().data[0]));
            vm.startStep.getInputPorts().data[0].setConnectionAnchor(new draw2d.layout.anchor.ChopboxConnectionAnchor(vm.startStep.getInputPorts().data[0]));*/

            return vm.startStep;


            ///////////////////////

            function onOutputPortMouseEnter() {
                this.canvas.uninstallEditPolicy(new draw2d.policy.connection.DragConnectionCreatePolicy());
                this.canvas.installEditPolicy(new draw2d.policy.connection.DragConnectionCreatePolicy({
                    createConnection: function(){
                        return EventConnection.create();
                    }
                }));
            }

            function onMouseEnter(){
                //this.showTooltip();
            }

            function onMouseLeave(){
                this.hideTooltip();
            }

            function showTooltip(){
                if (this.userData && this.userData.name){
                    this.tooltip = $("<div class='canvas-tooltip'>" + this.userData.name + "</div>", null, null)
                        .appendTo('body')
                        .hide()
                        .fadeIn(1000);
                    this.positionTooltip();
                }
            }

            function hideTooltip(){
                if(this.tooltip){
                    this.tooltip.fadeOut(500, function () {
                        $(this).remove();
                    });
                    this.tooltip = null;
                }
            }

            function positionTooltip() {
                if (!this.tooltip) {
                    return;
                }

                var width = this.tooltip.outerWidth(true);
                var pos = this.canvas.fromCanvasToDocumentCoordinate(
                    this.getAbsoluteX() + this.getWidth() / 2 - width / 2 + 8,
                    this.getAbsoluteY() + this.getHeight() + 10);

                pos.x += this.canvas.getScrollLeft();
                pos.y += this.canvas.getScrollTop();

                this.tooltip.css({'top': pos.y, 'left': pos.x});
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