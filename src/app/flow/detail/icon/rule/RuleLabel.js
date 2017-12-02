/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.flow')
        .service('RuleLabel', RuleLabelService);

    RuleLabelService.$inject = [
        'ngDialog',
        'CANVAS',
        'AutoFlowCanvasStory'
    ];

    /* @ngInject */
    function RuleLabelService(ngDialog, CANVAS, AutoFlowCanvasStory) {
        var vm = this;

        vm.create = create;

        ////////////////////////

        function create(){
            var ruleLabel = draw2d.shape.basic.Label.extend({
                NAME: CANVAS.basic.label.rule_label.config.name
            });

            vm.ruleLabel = angular.extend(new ruleLabel(CANVAS.basic.label.rule_label.attr), {
                onDoubleClick: onDoubleClick,
                setData: setData
            });
            return vm.ruleLabel;

            ////////////////

            function onDoubleClick(){
                var model = this;

                var eventConnection = model.getParent().getSource().getParent().getConnections().data.find(onFindEventConnection);
                var eventLabel = eventConnection.getChildren().data.find(onFindEventLabel);
                var eventName = null;
                if (eventLabel) {
                    eventName = eventLabel.getUserData().eventName;

                } else {
                    if (eventConnection.getChildren().data.find(onFindTimeLayout).getChildren().data.find(onFindTimeLabel)) {
                        eventName = "wait";
                    }
                }


                var sourceStep = eventConnection.getSource().getParent().getUserData();
                var targetStep = model.parent.getTarget().getParent().getUserData();

                var storyConnection = AutoFlowCanvasStory.story.storyTemplate.storyDefinition.connections.find(onFindConnection);


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

                            function onIterateConnection(connection, index){
                                if(connection.eventName === storyConnection.eventName && connection.sourceStep === sourceStep.name && connection.targetStep === targetStep.name){
                                    anchor.push(index);
                                }
                            }
                        },
                        isEditOn: function isEditOnFactory(){
                            return true;
                        },
                        ruleIndex: function indexFactory() {
                            return 0;
                        }
                    }
                });

                dialog.closePromise.then(onCloseRuleDialog);

                ////////////////////

                function onCloseRuleDialog(data) {

                    var connection = AutoFlowCanvasStory.story.storyTemplate.storyDefinition.connections.find(onFindConnection);
                    var rule = connection.rules.find(onFindRule);
                    if(rule){
                        model.setData(rule);
                    }

                    /////////////////////////

                    function onFindConnection(connection){
                        return connection.eventName === storyConnection.eventName && connection.sourceStep === storyConnection.sourceStep && connection.targetStep === storyConnection.targetStep;
                    }

                    function onFindRule(rule){
                        return rule.name === data.value.ruleName;
                    }

                    model.repaint();
                }

                /////////////////////////

                function onFindEventLabel(item){
                    return item.NAME === CANVAS.basic.label.event_label.config.name;
                }

                function onFindEventConnection(connection) {
                    return connection.NAME === CANVAS.basic.connection.event_connection.config.name;
                }

                function onFindConnection(connection){
                    return connection.sourceStep === sourceStep.name && connection.targetStep === targetStep.name && connection.eventName === eventName;
                }

                function onFindTimeLabel(item) {
                    return item.NAME === CANVAS.basic.label.time_label.config.name;
                }

                function onFindTimeLayout(item) {
                    return item.NAME === CANVAS.basic.layout.time_horizontal_layout.config.name;
                }

            }

            function setData(data){
                this.setUserData(data);
                this.setText(data.name);
            }
        }
    }
})(angular);