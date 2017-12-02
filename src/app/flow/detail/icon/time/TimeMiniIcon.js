/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.flow')
        .service('TimeMiniIcon', TimeMiniIconService);

    TimeMiniIconService.$inject = [
        '$filter',
        '$injector',
        'ngDialog',
        'CANVAS',
        'TimeLabel',
        'TimeLabelLocator',
        'AutoFlowCanvasStory',
        'TimeHorizontalLayout'
    ];

    /* @ngInject */
    function TimeMiniIconService($filter, $injector, ngDialog, CANVAS, TimeLabel, TimeLabelLocator, AutoFlowCanvasStory, TimeHorizontalLayout) {
        var vm = this;

        vm.create = create;

        ////////////////////////

        function create(attributes){
            var time = draw2d.shape.icon.Icon.extend({
                NAME: CANVAS.icon.time_mini.config.name,
                // createSet: createSet,
                openEditor: openEditor,
                getPersistentAttributes: getPersistentAttributes,
                setPersistentAttributes: setPersistentAttributes
            });

            vm.time = new time(CANVAS.icon.time_mini.attr);

            if(attributes){
                vm.time.setPersistentAttributes(attributes);
            }
            return vm.time;

            ////////////////

            function openEditor(eventName){
                var model = this;
                var scheduledEventActionSize = AutoFlowCanvasStory.story.storyTemplate.storyDefinition.actions.filter(onFilterScheduledEventAction).length;

                ///////////////////////

                function onFilterScheduledEventAction(action) {
                    return action.actionName.startsWith("scheduledEvent");
                }


                var actionName = "scheduledEvent" + scheduledEventActionSize;

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
                            return "time.action[" + actionName + "].Step[" + model.getParent().getSourceStep().name + "]";
                        },
                        isEditOn: function isEditOnFactory() {
                            return true;
                        },
                        eventName: function eventNameFactory() {
                            return eventName;
                        },
                        paramIndex: function indexFactory() {
                            return 0;
                        }
                    }
                });

                dialog.closePromise.then(onCloseParameter);

                /////////////////////////

                function onCloseParameter(data) {
                    var time = $filter('timeEditorParameter')(AutoFlowCanvasStory.story.storyTemplate.storyDefinition.actions, "time.action[" + actionName + "].Step[" + model.getParent().getSourceStep().name + "]");
                    var action = data.value.storyDefinition.actions.find(onFindAction);
                    var eventParam = action.params.find(onFindEventParam);
                    var timeLabel = TimeLabel.create();
                    timeLabel.setData({
                        actionName: actionName,
                        time: time,
                        eventName: eventParam.value
                    });


                    var container = TimeHorizontalLayout.create();
                    container.onDoubleClick = timeLabel.onDoubleClick;
                    container.add(new draw2d.shape.basic.Image({
                        path: CANVAS.icon.time_mini.config.image,
                        cssClass: CANVAS.icon.time_mini.attr.cssClass,
                        width: 22,
                        height: 22,
                        resizeable: false
                    }));
                    container.add(timeLabel);
                    model.getParent().add(container, TimeLabelLocator.create());

                    //////////////////

                    function onFindAction(item) {
                        return item.actionName === actionName;
                    }

                    function onFindEventParam(param) {
                        return param.name === 'eventName';
                    }
                }

            }

            function createSet() {
                var x = ((this.width - 40) / 2);
                return $injector.get('AutoFlowCanvasDraw').canvas.paper.image(CANVAS.icon.time_mini.config.image, x, 16, 40, 40);
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
