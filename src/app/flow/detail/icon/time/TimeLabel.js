/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.flow')
        .service('TimeLabel', TimeLabelService);

    TimeLabelService.$inject = [
        '$filter',
        'ngDialog',
        'CANVAS',
        'AutoFlowCanvasStory'
    ];

    /* @ngInject */
    function TimeLabelService($filter, ngDialog, CANVAS, AutoFlowCanvasStory) {
        var vm = this;

        vm.create = create;

        ////////////////////////

        function create(){
            var ruleLabel = draw2d.shape.basic.Label.extend({
                NAME: CANVAS.basic.label.time_label.config.name
            });

            vm.ruleLabel = angular.extend(new ruleLabel(CANVAS.basic.label.time_label.attr), {
                onDoubleClick: onDoubleClick,
                setData: setData
            });
            return vm.ruleLabel;

            ////////////////

            function onDoubleClick(){
                var model = this;
                var actionName = model.getUserData().actionName;

                var eventConnection = model.parent.parent.getSource().getParent().getConnections().find(onFindEventConnection);
                var sourceStep = eventConnection.getSource().getParent().getUserData();

                var dialog = ngDialog.open({
                    template: 'app/story-template/parameter/ParameterView.html',
                    appendClassName: 'ngdialog-theme-automationstudio modal-small',
                    controller: 'ParameterController',
                    controllerAs: 'vm',
                    resolve: {
                        model: function modelFactory() {
                            return AutoFlowCanvasStory.story.storyTemplate;
                        },
                        anchor: function anchorFactory() {
                            return "time.action[" + actionName + "].Step[" + sourceStep.name + "]";
                        },
                        eventName: function eventNameFactory(){
                            return eventConnection.getUserData().eventName;
                        },
                        isEditOn: function isEditOnFactory(){
                            return true;
                        },
                        paramIndex: function indexFactory() {
                            return 0;
                        }
                    }
                });

                dialog.closePromise.then(onCloseTimeDialog);

                ////////////////////

                function onCloseTimeDialog(data) {
                    var time = $filter('timeEditorParameter')(AutoFlowCanvasStory.story.storyTemplate.storyDefinition.actions, "time.action[" + actionName + "].Step[" + model.getParent().getParent().getSourceStep().name + "]");

                    model.setData({
                        actionName: actionName,
                        time: time
                    });

                    /////////////////////////

                    model.repaint();
                }

                /////////////////////////

                function onFindEventConnection(connection) {
                    return connection.NAME === CANVAS.basic.connection.event_connection.config.name;
                }

            }

            function setData(data){
                this.setUserData(data);
                this.setText(data.time);
            }
        }
    }
})(angular);