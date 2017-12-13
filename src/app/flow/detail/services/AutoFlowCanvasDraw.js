/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.flow')
        .service('AutoFlowCanvasDraw', AutoFlowCanvasDrawService);

    AutoFlowCanvasDrawService.$inject = [
        'CANVAS',
        'StepIcon',
        'StepLabel',
        'RuleIcon',
        'RuleLabel',
        'TimeLabel',
        'EventLabel',
        'TimeLocator',
        'RuleLocator',
        'EventLocator',
        'TimeMiniIcon',
        'RuleMiniIcon',
        'StartStepIcon',
        'ActionMiniIcon',
        'RuleConnection',
        'EventConnection',
        'TimeLabelLocator',
        'AutoFlowCanvasStory',
        'TimeHorizontalLayout',
        'DropInterceptorPolicy',
        'CanvasKeyboardPolicy'
    ];

    /* @ngInject */
    function AutoFlowCanvasDrawService(
        CANVAS,
        StepIcon,
        StepLabel,
        RuleIcon,
        RuleLabel,
        TimeLabel,
        EventLabel,
        TimeLocator,
        RuleLocator,
        EventLocator,
        TimeMiniIcon,
        RuleMiniIcon,
        StartStepIcon,
        ActionMiniIcon,
        RuleConnection,
        EventConnection,
        TimeLabelLocator,
        AutoFlowCanvasStory,
        TimeHorizontalLayout,
        DropInterceptorPolicy,
        CanvasKeyboardPolicy) {

        var vm = this;

        vm.undo = undo;
        vm.redo = redo;
        vm.create = create;
        vm.zoomIn = zoomIn;
        vm.zoomOut = zoomOut;
        vm.loadFlow = loadFlow;
        vm.exportAsJson = exportAsJson;
        vm.importFromJson = importFromJson;
        vm.createExistedItem = createExistedItem;

        ////////////////////////

        function create(initObject){
            vm.canvas = new draw2d.Canvas(initObject.element.attr("id"), 3000, 3000);
            vm.canvas.onDrop = onDrop;
            vm.canvas.setScrollArea("#" + initObject.element.attr("id"));
            vm.canvas.setScrollArea("#" + initObject.element.attr("id"));
            vm.canvas.installEditPolicy(DropInterceptorPolicy.create());

            vm.canvas.uninstallEditPolicy('draw2d.policy.canvas.DefaultKeyboardPolicy');
            vm.canvas.installEditPolicy(CanvasKeyboardPolicy.create());

            vm.canvas.uninstallEditPolicy('draw2d.policy.canvas.DropInterceptorPolicy');

            (CANVAS.canvas.hasZoom) && vm.canvas.installEditPolicy(new draw2d.policy.canvas.WheelZoomPolicy());
            (CANVAS.canvas.hasGrid) && vm.canvas.installEditPolicy(new draw2d.policy.canvas.ShowGridEditPolicy());
            (CANVAS.canvas.isReadonly) && vm.canvas.installEditPolicy(new draw2d.policy.canvas.ReadOnlySelectionPolicy());
            (CANVAS.canvas.hasCoronaDecoration) && vm.canvas.installEditPolicy(new draw2d.policy.canvas.CoronaDecorationPolicy());

            var startStep = StartStepIcon.create(vm.canvas.html.parent().width()/2, 60);
            vm.canvas.add(startStep);

            vm.canvas.on("connect", function(emitter, event){
                event.connection.toBack();
            });

            // vm.canvas.on("figure:add", function(emitter, event){
            //     console.log("Figure added");
            // });
            //
            // vm.canvas.on("figure:remove", function(emitter, event){
            //     console.log("Figure removed");
            // });
            //
            // vm.canvas.on("select", function(emitter, event){
            //     console.log("Figure selected: "+event);
            // });
            //
            // vm.canvas.on("unselect", function(emitter, event){
            //     console.log("Figure unselected: "+event);
            // });
            //
            // vm.canvas.on("dblclick", function(emitter, event){
            //     console.log("double click: "+event);
            // });
            //
            // vm.canvas.on("click", function(emitter, event){
            //     console.log("click: "+event);
            // });
            //
            // vm.canvas.on("contextmenu", function(emitter, event){
            //     console.log("Context Menu: "+event);
            // });

            return vm.canvas;

            ///////////////

            function onDrop(droppedDomNode, x, y, shiftKey, ctrlKey) {
                var type =  angular.element(droppedDomNode).data("shape");
                eval(type + ".create(" + x + "," + y + ")");  // example: StepIcon.create(x, y)

            }
        }

        function undo(){
            vm.canvas.getCommandStack().undo();
        }

        function redo(){
            vm.canvas.getCommandStack().redo();
        }


        function loadFlow(flow){
            vm.flow = flow;
            vm.canvas.clear();

            angular.forEach(vm.flow, onIterateFlow);

            var ruleFigures = vm.canvas.figures.data.filter(onFilterFigure);

            angular.forEach(ruleFigures, onIterateRule);

            /////////////////

            function onIterateFlow(item) {
                var figure = createExistedItem(item);
                vm.canvas.add(figure);
            }

            function onFilterFigure(figure) {
                return figure.NAME === CANVAS.icon.rule.config.name;
            }

            function onIterateRule(rule) {
                rule.getOutputPorts().data[0].onConnect = RuleIcon.onConnect;
                rule.getOutputPorts().data[0].onMouseEnter = RuleIcon.onOutputPortMouseEnter;
            }
        }

        function createExistedItem(item, x, y){
            var figure;

            if(!item.type){
                switch (item) {
                    case CANVAS.basic.locator.event_locator.config.name:
                        figure = EventLocator.create(item);
                        break;
                    case CANVAS.basic.locator.rule_locator.config.name:
                        figure = RuleLocator.create(item);
                        break;
                    case CANVAS.basic.locator.time_locator.config.name:
                        figure = TimeLocator.create(item);
                        break;
                    case CANVAS.basic.locator.time_label_locator.config.name:
                        figure = TimeLabelLocator.create(item);
                        break;
                    default:
                        figure = eval('new ' + item + '()');
                        break;
                }
                figure.x = x;
                figure.y = y;
            }
            else{
                switch (item.type) {
                    case CANVAS.icon.step.config.name:
                        figure = StepIcon.create(item.x, item.y, item);
                        break;
                    case CANVAS.icon.start_step.config.name:
                        figure = StartStepIcon.create(item.x, item.y, item);
                        break;
                    case CANVAS.basic.label.step_label.config.name:
                        figure = StepLabel.create(item);
                        break;
                    case CANVAS.icon.action.config.name:
                        figure = ActionMiniIcon.create(item);
                        break;
                    case CANVAS.icon.rule_mini.config.name:
                        figure = RuleMiniIcon.create(item);
                        break;
                    case CANVAS.icon.rule.config.name:
                        figure = RuleIcon.create(item);
                        break;
                    case CANVAS.basic.label.event_label.config.name:
                        figure = EventLabel.create(item);
                        break;
                    case CANVAS.basic.connection.event_connection.config.name:
                        figure = EventConnection.create(item);
                        break;
                    case CANVAS.basic.connection.rule_connection.config.name:
                        figure = RuleConnection.create(item);
                        break;
                    case CANVAS.basic.label.time_label.config.name:
                        figure = TimeLabel.create(item);
                        break;
                    case CANVAS.basic.label.rule_label.config.name:
                        figure = RuleLabel.create(item);
                        break;
                    case CANVAS.icon.time_mini.config.name:
                        figure = TimeMiniIcon.create(item);
                        break;
                    case CANVAS.basic.layout.time_horizontal_layout.config.name:
                        figure = TimeHorizontalLayout.create(item);
                        break;
                    case "draw2d.shape.basic.Image":
                        figure = new draw2d.shape.basic.Image(item);
                        break;
                    default:
                        figure = eval('new ' + item.type + '()');
                        break;
                }
            }

            return figure;
        }

        function zoomIn() {
            vm.canvas.setZoom(vm.canvas.getZoom() * 0.7, true);
        }

        function zoomOut() {
            vm.canvas.setZoom(vm.canvas.getZoom() * 1.3, true);
        }

        function importFromJson(json){
            var reader = new draw2d.io.json.Reader();
            reader.unmarshal(vm.canvas, json);
        }

        function exportAsJson(){
            var writer = new draw2d.io.json.Writer();
            writer.marshal(vm.canvas, function(json){
                var canvasData = JSON.stringify(json, null, '  ');
                var storyTemplate = JSON.stringify(AutoFlowCanvasStory.story.storyTemplate, null, '  ');

                console.groupCollapsed("canvas data");
                console.log(canvasData);
                console.groupEnd();

                console.groupCollapsed("story template data");
                console.log(storyTemplate);
                console.groupEnd();

                console.groupCollapsed("flow data");
                console.log(
                    JSON.stringify(
                        {
                            canvasData: json,
                            storyTemplate: AutoFlowCanvasStory.story.storyTemplate
                        },
                        null,
                        '  '
                    )
                );
                console.groupEnd();
                vm.canvasData = canvasData;
            });
        }
    }
})(angular);
