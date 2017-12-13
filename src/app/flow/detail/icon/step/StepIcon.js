/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.flow')
        .service('StepIcon', StepIconService);

    StepIconService.$inject = [
        '$filter',
        '$state',
        '$injector',
        'ngDialog',
        'CANVAS',
        'StepLabel',
        'ActionMiniIcon',
        'EventConnection',
        'AlertService',
        'VerticalInputPortLocator',
        'VerticalOutputPortLocator'
    ];
    /* @ngInject */
    function StepIconService($filter, $state, $injector, ngDialog, CANVAS, StepLabel, ActionMiniIcon, EventConnection, AlertService, VerticalInputPortLocator, VerticalOutputPortLocator) {
        var vm = this;

        vm.create = create;
        vm.isDashBoard = $state.params.isDashboard;

        ////////////////////////

        function create(x, y, attributes){
            vm.canvas = $injector.get('AutoFlowCanvasDraw').canvas;

            var step = draw2d.shape.basic.Rectangle.extend({
                NAME: CANVAS.icon.step.config.name,
                onMouseEnter: onMouseEnter,
                onMouseLeave: onMouseLeave,
                showTooltip: showTooltip,
                hideTooltip: hideTooltip,
                onDoubleClick: onDoubleClick,
                positionTooltip: positionTooltip,
                getPersistentAttributes: getPersistentAttributes,
                setPersistentAttributes: setPersistentAttributes
            });

            vm.step = new step(CANVAS.icon.step.attr);
            vm.step.createPort("input",VerticalInputPortLocator.create());
            vm.step.createPort("output",VerticalOutputPortLocator.create());


            addActionMiniIcon();

            if (attributes) {
                vm.step.setPersistentAttributes(attributes);
            } else {
                var dialog = ngDialog.open({
                    template: 'app/flow/detail/icon/step/StepIconView.html',
                    appendClassName: 'ngdialog-theme-automationstudio modal-large',
                    controller: 'StepIconController',
                    controllerAs: 'vm',
                    showClose: false,
                    closeByEscape: false,
                    closeByNavigation: true,
                    resolve: {
                        model: function modelFactory() {
                            return vm.step;
                        }
                    }
                });
                dialog.closePromise.then(onCloseStepDialog);
            }

            vm.step.getOutputPorts().data[0].onMouseEnter = onOutputPortMouseEnter;
            vm.step.installEditPolicy(new draw2d.policy.figure.SlimSelectionFeedbackPolicy());
            vm.canvas.getCommandStack().execute(new draw2d.command.CommandAdd(vm.canvas, vm.step, x, y));
            //vm.step.getOutputPorts().data[0].setConnectionAnchor(new draw2d.layout.anchor.ChopboxConnectionAnchor(vm.step.getOutputPorts().data[0]));
            //vm.step.getInputPorts().data[0].setConnectionAnchor(new draw2d.layout.anchor.ChopboxConnectionAnchor(vm.step.getInputPorts().data[0]));

            return vm.step;


            ///////////////////////

            function onCloseStepDialog(data) {
                if (!data.value || data.value === '$closeButton' || data.value === '$document') {
                    return;
                }
                vm.step.userData =  data.value && data.value.userData;

                var stepLabel = StepLabel.create();
                stepLabel.setText($filter('uppercase')(vm.step.userData && vm.step.userData.name ? vm.step.userData.name : ''));
                vm.step.add(stepLabel, new draw2d.layout.locator.CenterLocator());
            }

            function onOutputPortMouseEnter() {
                this.canvas.uninstallEditPolicy(new draw2d.policy.connection.DragConnectionCreatePolicy());
                this.canvas.installEditPolicy(new draw2d.policy.connection.DragConnectionCreatePolicy({
                    createConnection: function(){
                        return EventConnection.create();
                    }
                }));
            }

            function addActionMiniIcon(){
                var action = ActionMiniIcon.create();
                vm.step.add(action, new draw2d.layout.locator.XYRelPortLocator(CANVAS.icon.step.attr.width, -5));
            }


            function onDoubleClick(){
                if(!vm.isDashboard) {
                    var model = this;

                    var dialog = ngDialog.open({
                        template: 'app/flow/detail/icon/step/StepIconView.html',
                        appendClassName: 'ngdialog-theme-automationstudio modal-large',
                        controller: 'StepIconController',
                        controllerAs: 'vm',
                        closeByEscape: false,
                        resolve: {
                            model: function modelFactory(){
                                return model;
                            }
                        }
                    });
                    dialog.closePromise.then(onCloseStepDialog);
                } else {
                    AlertService.error("flow.errors.step_is_not_editable");
                }


                /////////////////

                function onCloseStepDialog(data) {
                    if (!data.value || data.value === '$closeButton' || data.value === '$document') {
                        return;
                    }
                    model.userData =  data.value && data.value.userData;
                    var label = model.children.data.find(onFindLabel);
                    if (label) {
                        label.figure.setText($filter('uppercase')(model.userData.name));
                    } else {
                        var stepLabel = StepLabel.create();
                        stepLabel.setText($filter('uppercase')(model && model.userData.name ? model.userData.name : ''));
                        model.add(stepLabel, new draw2d.layout.locator.CenterLocator());
                    }

                    ////////////////

                    function onFindLabel(data){
                        return data.figure.NAME === CANVAS.basic.label.step_label.config.name;
                    }
                }

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
                    var locator = $injector.get('AutoFlowCanvasDraw').createExistedItem(item.locator, CANVAS.icon.step.attr.width , -5);
                    model.add(figure, locator);
                }
            }
        }
    }
})(angular);