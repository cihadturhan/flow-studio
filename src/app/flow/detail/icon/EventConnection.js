/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.flow')
        .service('EventConnection', EventConnectionService);

    EventConnectionService.$inject = [
        '$injector',
        '$translate',
        'ngDialog',
        'CANVAS',
        'RuleIcon',
        'EventLabel',
        'TimeLocator',
        'TimeMiniIcon',
        'EventLocator',
        'RuleMiniIcon',
        'AlertService',
        'RuleLocator',
        'RuleConnection',
        'AutoFlowCanvasStory'
    ];

    /* @ngInject */
    function EventConnectionService(
        $injector,
        $translate,
        ngDialog,
        CANVAS,
        RuleIcon,
        EventLabel,
        TimeLocator,
        TimeMiniIcon,
        EventLocator,
        RuleMiniIcon,
        AlertService,
        RuleLocator,
        RuleConnection,
        AutoFlowCanvasStory) {

        var vm = this;
        vm.create = create;

        ////////////////////////

        function create(attributes, extras) {
            vm.canvas = $injector.get('AutoFlowCanvasDraw').canvas;
            var connection = draw2d.Connection.extend({
                NAME: CANVAS.basic.connection.event_connection.config.name,
                getPersistentAttributes: getPersistentAttributes,
                setPersistentAttributes: setPersistentAttributes,
                createRuleConnection: createRuleConnection,
                getSourceStep: getSourceStep
            });

            vm.connection = new connection(CANVAS.basic.connection.event_connection.attr);
            if(extras && extras.target){
                vm.connection.setTarget(extras.target);
                vm.connection.setSource(extras.source);
            }
            if (attributes) {
                vm.connection.setPersistentAttributes(attributes);
            } else {
                var dialog = ngDialog.open({
                    template: 'app/flow/detail/icon/event/EventLabelView.html',
                    appendClassName: 'ngdialog-theme-automationstudio modal-large',
                    controller: 'EventLabelController',
                    controllerAs: 'vm',
                    showClose: false,
                    closeByDocument: false,
                    // closeByEscape: false,
                    closeByNavigation: true,
                    resolve: {
                        model: function modelFactory() {
                            return vm.connection;
                        }
                    }
                });
                dialog.closePromise.then(onCloseEventDialog);
            }

            vm.connection.setRouter(new draw2d.layout.connection.CustomFanConnectionRouter());
            vm.connection.setTargetDecorator(new draw2d.decoration.connection.ArrowDecorator(17, 8));
            return vm.connection;

            //////////////////////

            function onCloseEventDialog(data) {
                if(!data.value){
                    vm.canvas.getCommandStack().undo();
                    return;
                }
                if (!(vm.connection.getSourceStep() && vm.connection.getSourceStep().name)
                    || !(vm.connection.getTarget().getParent().getUserData() && vm.connection.getTarget().getParent().getUserData().name)) {
                    AlertService.warning("flow.errors.connection_empty_steps");
                    vm.canvas.getCommandStack().undo();
                    return;
                }

                var ruleMiniIcon = RuleMiniIcon.create();
                vm.connection.add(ruleMiniIcon, RuleLocator.create());
                ruleMiniIcon.toFront();

                AutoFlowCanvasStory.story.storyTemplate.storyDefinition.connections.push(
                    {
                        rules: [],
                        actions: [],
                        eventName: data.value.userData.eventName,
                        sourceStep: vm.connection.getSourceStep().name,
                        targetStep: vm.connection.getTarget().getParent().getUserData().name
                    }
                );

                if (data.value.userData.eventName === 'wait') {
                    var timeMiniIcon = TimeMiniIcon.create();
                    vm.connection.add(timeMiniIcon, TimeLocator.create());
                    timeMiniIcon.openEditor(data.value.userData.eventName);
                } else {
                    var event = EventLabel.create();
                    event.setData(data.value.userData || {eventName: $translate.instant('flow.icon.event.add')});
                    vm.connection.add(event, EventLocator.create());
                    event.toFront();
                }
            }


            function createRuleConnection() {
                var rule = RuleIcon.create();
                vm.canvas.add(rule);

                var ruleMini = this.children.data.find(onFindRuleMini);

                /////////////////////////

                function onFindRuleMini(item) {
                    return item.figure.NAME === CANVAS.icon.rule_mini.config.name;
                }

                rule.setX(ruleMini.figure.x);
                rule.setY(ruleMini.figure.y);
                this.remove(ruleMini.figure);

                var oldTarget = this.getTarget();
                this.setTarget(rule.getInputPort(0));
                this.setTargetDecorator(null);
                var ruleConnection = RuleConnection.create(null, {
                    source: rule.getOutputPort(0),
                    target: oldTarget

                });
                vm.canvas.add(ruleConnection);

            }

            function getSourceStep(){
                return this.getSource().getParent().getUserData();
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

                node = vm.canvas.getFigure(memento.target.node);
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