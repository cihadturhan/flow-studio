/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.flow')
        .service('RuleIcon', RuleIconService);

    RuleIconService.$inject = [
        'ngDialog',
        'CANVAS',
        'RuleLabel',
        'RuleConnection',
        'AutoFlowCanvasStory'
    ];

    /* @ngInject */
    function RuleIconService(ngDialog, CANVAS, RuleLabel, RuleConnection, AutoFlowCanvasStory) {
        var vm = this;

        vm.create = create;
        vm.onConnect = onConnect;
        vm.onOutputPortMouseEnter = onOutputPortMouseEnter;

        ////////////////////////

        function create(attributes) {
            var rule = draw2d.shape.icon.Icon.extend({
                NAME: CANVAS.icon.rule.config.name,
                getPersistentAttributes: getPersistentAttributes,
                setPersistentAttributes: setPersistentAttributes,
                createSet: createSet
            });

            vm.rule = new rule(CANVAS.icon.rule.attr);
            createPort('input');
            createPort('output');
            vm.rule.getOutputPorts().data[0].onConnect = onConnect;
            vm.rule.getOutputPorts().data[0].onMouseEnter = onOutputPortMouseEnter;
            vm.rule.installEditPolicy(new draw2d.policy.figure.SlimSelectionFeedbackPolicy());
            vm.rule.installEditPolicy(new draw2d.policy.figure.SlimSelectionFeedbackPolicy());

            if (attributes) {
                vm.rule.setPersistentAttributes(attributes);
            }

            vm.rule.getOutputPorts().data[0].setConnectionAnchor(new draw2d.layout.anchor.ChopboxConnectionAnchor(vm.rule.getOutputPorts().data[0]));
            vm.rule.getInputPorts().data[0].setConnectionAnchor(new draw2d.layout.anchor.ChopboxConnectionAnchor(vm.rule.getInputPorts().data[0]));

            return vm.rule;

            ////////////////

            function createSet() {
                var x = ((this.width - 40) / 2);
                return vm.rule.canvas.paper.image(CANVAS.icon.rule.config.image, x, 16, 40, 40);
            }

            function createPort(locator) {
                var locatorObject;
                switch (locator) {
                    case 'input':
                        locatorObject = new draw2d.layout.locator.InputPortLocator();
                        break;
                    case 'output':
                        locatorObject = new draw2d.layout.locator.OutputPortLocator();
                        break;
                }
                var port = vm.rule.createPort(locator, locatorObject);
                //port.setConnectionAnchor(new draw2d.layout.anchor.ChopboxConnectionAnchor(port));
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

                function onIterateLabel(item) {
                    var figure = $injector.get('AutoFlowCanvasDraw').createExistedItem(item);
                    figure.attr(item);
                    var locator = $injector.get('AutoFlowCanvasDraw').createExistedItem(item.locator, item.x - item.width, item.y);
                    model.add(figure, locator);
                }
            }
        }

        function onConnect(ruleConnection) {
            if (!(ruleConnection.getSource() && ruleConnection.getTarget() && ruleConnection.getCanvas())) {
                return;
            }
            var eventConnection = ruleConnection.getSource().getParent().getConnections().data.find(onFindEventConnection);
            var eventLabel = eventConnection.getChildren().data.find(onFindEventLabel);
            var eventName = null;
            if (eventLabel) {
                eventName = eventLabel.getUserData().eventName;

            } else {
                if (eventConnection.getChildren().data.find(onFindTimeLayout).getChildren().data.find(onFindTimeLabel)) {
                    eventName = "wait";
                }
            }

            var sourceStep = eventConnection.getSourceStep().name;
            var targetStep = ruleConnection.getTargetStep().name;

            var storyConnection = AutoFlowCanvasStory.story.storyTemplate.storyDefinition.connections.find(onFindConnection);
            if (!storyConnection) {
                storyConnection = {
                    rules: [],
                    actions: [],
                    eventName: eventName,
                    sourceStep: sourceStep,
                    targetStep: targetStep
                };
                AutoFlowCanvasStory.story.storyTemplate.storyDefinition.connections.push(storyConnection);
            }

            var dialog = ngDialog.open({
                template: 'app/story-template/rule/RuleView.html',
                appendClassName: 'ngdialog-theme-automationstudio modal-large',
                controller: 'RuleController',
                controllerAs: 'vm',
                resolve: {
                    model: function modelFactory() {
                        return AutoFlowCanvasStory.story.storyTemplate;
                    },
                    anchor: function anchorFactory() {
                        var anchor = [];
                        angular.forEach(AutoFlowCanvasStory.story.storyTemplate.storyDefinition.connections, onIterateConnection);
                        return angular.toJson(anchor);

                        //////////////////

                        function onIterateConnection(connection, index) {
                            if (connection.eventName === storyConnection.eventName && connection.sourceStep === storyConnection.sourceStep && connection.targetStep === storyConnection.targetStep) {
                                anchor.push(index);
                            }
                        }
                    },
                    isEditOn: function isEditOnFactory() {
                        return true;
                    },
                    ruleIndex: function indexFactory() {
                        return 0;
                    }
                }
            });
            dialog.closePromise.then(onCloseRuleIconDialog);

            /////////////////////////

            function onFindEventLabel(item) {
                return item.NAME === CANVAS.basic.label.event_label.config.name;
            }

            function onFindTimeLabel(item) {
                return item.NAME === CANVAS.basic.label.time_label.config.name;
            }

            function onFindTimeLayout(item) {
                return item.NAME === CANVAS.basic.layout.time_horizontal_layout.config.name;
            }

            function onFindEventConnection(connection) {
                return connection.getUserData().eventName;
            }

            function onFindConnection(connection) {
                return connection.sourceStep === sourceStep && connection.targetStep === targetStep && connection.eventName === eventName;
            }

            function onCloseRuleIconDialog(data) {
                var ruleLabel = RuleLabel.create();
                ruleConnection.add(ruleLabel, new draw2d.layout.locator.ManhattanMidpointLocator());

                var connection = AutoFlowCanvasStory.story.storyTemplate.storyDefinition.connections.find(onFindConnection);
                var rule = connection.rules.find(onFindRule);
                if (rule) {
                    ruleLabel.setData(rule);
                }

                ////////////////

                function onFindConnection(connection) {
                    return connection.eventName === storyConnection.eventName && connection.sourceStep === storyConnection.sourceStep && connection.targetStep === storyConnection.targetStep;
                }

                function onFindRule(rule) {
                    return rule.name === data.value.ruleName;
                }
            }

        }

        function onOutputPortMouseEnter() {
            this.canvas.uninstallEditPolicy(new draw2d.policy.connection.DragConnectionCreatePolicy());
            this.canvas.installEditPolicy(new draw2d.policy.connection.DragConnectionCreatePolicy({
                createConnection: function () {
                    return RuleConnection.create(null, null);
                }
            }));
        }

    }
})(angular);
