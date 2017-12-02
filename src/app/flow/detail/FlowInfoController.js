/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.flow')
        .controller('FlowInfoController', FlowInfoController);

    FlowInfoController.$inject = [
        '$state',
        '$rootScope',
        '$scope',
        '$timeout',
        '$filter',
        'model',
        'MODAL',
        'isDashboard',
        'isDraft',
        'buttonType',
        'isCanvas',
        'storyID',
        'StoryTemplate',
        'AlertService',
        'AutoFlowCanvasDraw',
        'StoryMonitoring',
        'STORY_TEMPLATE_CREATION_TYPE',
        'CANVAS',
        'DateUtils'
    ];

    /* @ngInject */
    function FlowInfoController($state, $rootScope, $scope, $timeout, $filter, model, MODAL, isDashboard, isDraft, buttonType, isCanvas, storyID, StoryTemplate, AlertService, AutoFlowCanvasDraw, StoryMonitoring, STORY_TEMPLATE_CREATION_TYPE, CANVAS, DateUtils) {
        var vm = this;

        vm.model = model;
        vm.isDashboard = isDashboard;
        vm.isDraft = isDraft;
        vm.storyID = storyID;
        vm.activeButtonType = buttonType;
        vm.isCanvas = isCanvas;
        vm.dataListStatus = {actions: false, events: false, keys: false, reportVariables: false, storyVariables: false};

        vm.start = start;
        vm.draft = draft;
        vm.cancel = cancel;
        vm.changeDate = changeDate;
        vm.creationTypeConstants = STORY_TEMPLATE_CREATION_TYPE;
        vm.buttonTypes = CANVAS.buttons;


        activate();

        /////////////////////////

        function activate() {
            if (!vm.isDashboard && !vm.isDraft) {
                vm.model.storyDefinition.storyName = "";
            }
            initializeDatePicker();
            vm.hiddenItems = {};
            $rootScope.loadingSpinner = "show";
            StoryTemplate.getStoryTempHiddenReportItemList({storyTemplateID: vm.model.templateID}, onSuccessHiddenItems, onErrorHiddenItems);

            /////////////////
            function onSuccessHiddenItems(result) {
                angular.forEach(result.data, onIterateData);
                initializeDataList();
                $rootScope.loadingSpinner = "";

                ////////////
                function onIterateData(data) {
                    var valueArray = [];
                    if (vm.hiddenItems.hasOwnProperty(data.type)) {
                        valueArray = vm.hiddenItems[data.type];
                        if (valueArray.indexOf(data.value) < 0) {
                            valueArray.push(data.value);
                            vm.hiddenItems[data.type] = valueArray;
                        }
                    } else {
                        valueArray.push(data.value);
                        vm.hiddenItems[data.type] = valueArray;
                    }
                }

            }

            function onErrorHiddenItems(result) {
                $rootScope.loadingSpinner = "";
            }
        }

        function draft() {
            vm.model.storyDefinition.startDate = vm.model.storyDefinition.startDate ? vm.model.storyDefinition.startDate.format(vm.startDatePickerOptions.format) : null;
            vm.model.storyDefinition.stopDate = vm.model.storyDefinition.stopDate ? vm.model.storyDefinition.stopDate.format(vm.stopDatePickerOptions.format) : null;
            vm.model.name = vm.model.storyDefinition.storyName;
            vm.model.filledStoryInfo = {
                startDate: vm.model.storyDefinition.startDate,
                stopDate: vm.model.storyDefinition.stopDate,
                storyName: vm.model.storyDefinition.storyName
            };

            if (vm.isCanvas) {
                AutoFlowCanvasDraw.exportAsJson();
            }
            var request = {
                storyTemplate: vm.model,
                storyTemplateDiagram: {value: AutoFlowCanvasDraw.canvasData},
                creationType: vm.model.storyTemplateDiagram ? vm.creationTypeConstants.RepresentationAndCanvas : vm.creationTypeConstants.RepresentationOnly
            };
            $rootScope.loadingSpinner = "show";
            StoryTemplate.postStoryTemplateDraft(request, onSuccessOfDraft, onError);

            ///////////
            function onSuccessOfDraft(result) {
                $rootScope.loadingSpinner = "";
                AlertService.success(result.message);
                $scope.closeThisDialog();
            }

            function onError(result) {
                // in order to rollback story name when update is failed
                $rootScope.loadingSpinner = "";
            }

        }

        function start() {
            try {
                vm.model.storyDefinition.startDate = vm.model.storyDefinition.startDate.format(vm.startDatePickerOptions.format);
                vm.model.storyDefinition.stopDate = vm.model.storyDefinition.stopDate.format(vm.stopDatePickerOptions.format);
                vm.model.storyDefinition.reportItems = prepareReportItems();
                vm.model.name = vm.model.storyDefinition.storyName;
                vm.model.filledStoryInfo = {
                    startDate: vm.model.storyDefinition.startDate,
                    stopDate: vm.model.storyDefinition.stopDate,
                    storyName: vm.model.storyDefinition.storyName
                };

                if (vm.isCanvas) {
                    AutoFlowCanvasDraw.exportAsJson();
                }
                var request = {
                    storyTemplate: vm.model,
                    storyTemplateDiagram: {value: AutoFlowCanvasDraw.canvasData}
                };
                $rootScope.loadingSpinner = "show";
                if (vm.isDashboard) {
                    StoryTemplate.putStoryTemplateUpdateStory({storyID: vm.storyID}, request, onSuccess, onError);
                } else {
                    StoryTemplate.postStoryTemplateStartStory(request, onSuccess, onError);
                }

            } catch (error) {
                AlertService.warning("global.errors.unknown");
            }

            ///////////////
            function onSuccess(result) {
                $rootScope.loadingSpinner = "";
                if (result.data && result.data.storyID) {
                    vm.storyID = result.data.storyID;
                    var reportItemArray = [];
                    angular.forEach(vm.dataList, onIterateDataList);
                }
                vm.isDashboard ? AlertService.info("flow.success.updated") : AlertService.info("flow.success.deployed");
                waitForClose(true);

                ////////////////////
                function onIterateDataList(value, type) {
                    reportItemArray = reportItemArray.concat(value.data);
                }
            }

            function onError(result) {
                $rootScope.loadingSpinner = "";
                waitForClose(false);
            }

            function prepareReportItems() {
                var reportItems = [];
                angular.forEach(vm.dataList, onIterateDataList);
                return reportItems;

                function onIterateDataList(data) {
                    angular.forEach(data.data, onIterateData);

                    function onIterateData(addedData) {
                        reportItems.push(addedData);
                    }
                }
            }
        }

        function waitForClose(isClose) {
            $timeout(function () {
                vm.isInSaveProgress = false;
                if (isClose) {
                    $scope.closeThisDialog();
                    if (!$rootScope.gatewayParams) {
                        $state.go("dashboard");
                    } else {
                        $state.go("smDashboard", {storyID: vm.storyID});
                    }
                }
            }, MODAL.closeTimeout);
        }

        function cancel() {
            $scope.closeThisDialog();
        }

        function initializeDatePicker() {
            vm.startDatePickerOptions = {
                icons: {
                    next: 'glyphicon glyphicon-arrow-right',
                    previous: 'glyphicon glyphicon-arrow-left',
                    up: 'glyphicon glyphicon-arrow-up',
                    down: 'glyphicon glyphicon-arrow-down'
                },
                useCurrent: false,
                format: "YYYY/MM/DD HH:mm:ss",
                ignoreReadonly: true
            };
            vm.stopDatePickerOptions = {
                icons: {
                    next: 'glyphicon glyphicon-arrow-right',
                    previous: 'glyphicon glyphicon-arrow-left',
                    up: 'glyphicon glyphicon-arrow-up',
                    down: 'glyphicon glyphicon-arrow-down'
                },
                useCurrent: false,
                format: "YYYY/MM/DD HH:mm:ss",
                ignoreReadonly: true
            };

            configureMinDateOfStartDate(vm.model.storyDefinition.startDate);
            configureMinDateOfStopDate(vm.model.storyDefinition.stopDate);

            assignHideDatePickerOnSelected();
        }

        function configureMinDateOfStartDate(startDate) {
            // time is set to today 00:00:00, otherwise when date is bigger than today but clock is smaller than current, today cannot be selected again.
            // For example, today is 06.10.2017 10:55:13, after the date is selected as 07.10.2017 09:55:13 and then tried to select 06.10.2017 09:55:13 plugin does not allow.
            var currentDate = moment();
            currentDate.hour(0).minute(0).second(0);
            // if start date is less than today on update mode, configure min date for datetimepicker component.
            if (startDate && moment(startDate, "YYYY/MM/DD") < currentDate) {
                vm.startDatePickerOptions.minDate = moment(startDate, vm.startDatePickerOptions.format);
                vm.startDatePickerOptions.disabledDates = DateUtils.getDateArrayForGivenRange(new Date(startDate), DateUtils.getYesterday());
            }
            else {
                vm.startDatePickerOptions.minDate = currentDate;
            }
        }

        function configureMinDateOfStopDate(stopDate) {
            // time is set to today 00:00:00, otherwise when date is bigger than today but clock is smaller than current, today cannot be selected again.
            // For example, today is 06.10.2017 10:55:13, after the date is selected as 07.10.2017 09:55:13 and then tried to select 06.10.2017 09:55:13 plugin does not allow.
            var currentDate = moment();
            currentDate.hour(0).minute(0).second(0);
            if (stopDate && moment(stopDate, "YYYY/MM/DD") < currentDate) {
                vm.stopDatePickerOptions.minDate = moment(stopDate, vm.stopDatePickerOptions.format);
                vm.stopDatePickerOptions.disabledDates = DateUtils.getDateArrayForGivenRange(new Date(stopDate), DateUtils.getYesterday());
            }
            else {
                vm.stopDatePickerOptions.minDate = currentDate;
            }
        }

        function changeDate(startDate, stopDate) {
            if (startDate && startDate >= moment()) {
                vm.stopDatePickerOptions.minDate = new Date(startDate);
            }
            if (stopDate && stopDate >= moment()) {
                vm.startDatePickerOptions.maxDate = new Date(stopDate);
            }
        }

        function assignHideDatePickerOnSelected() {
            $(document).off('dp.change', '.selectDatePicker').on('dp.change', '.selectDatePicker', function (e) {
                $(this).data('DateTimePicker').hide();
            });
        }

        function initializeDataList() {
            if (vm.isDashboard) {
                StoryMonitoring.getStoryReportItem({storyID: vm.storyID}, {}, onReportStatSuccess, onReportStatError);
            } else {
                vm.dataList = {
                    actions: {
                        text: "story_template.reportItems.actions",
                        data: vm.model.storyDefinition.actions && vm.model.storyDefinition.actions.filter(filterActionData).map(onMapActionData) || []
                    },
                    events: {
                        text: "story_template.reportItems.events ",
                        data: vm.model.storyDefinition.events && vm.model.storyDefinition.events.filter(filterEventData).map(onMapEventData) || []
                    },
                    keys: {
                        text: "story_template.reportItems.keys",
                        data: vm.model.storyDefinition.variables && vm.model.storyDefinition.variables.filter(filterKeyData).map(onMapKeyData) || []
                    },
                    storyVariables: {
                        text: "story_template.reportItems.storyVariables",
                        data: vm.model.storyDefinition.variables && vm.model.storyDefinition.variables.filter(filterStoryVariable).map(onMapStoryVariable) || []
                    }
                };
            }

            function onReportStatSuccess(response) {
                vm.reportItemList = {};
                angular.forEach(response, onIterateReportStat);
                vm.dataList = {
                    actions: {
                        text: "story_template.reportItems.actions",
                        data: vm.model.storyDefinition.actions && vm.model.storyDefinition.actions.filter(filterActionData).map(onMapActionData) || []
                    },
                    events: {
                        text: "story_template.reportItems.events ",
                        data: vm.model.storyDefinition.events && vm.model.storyDefinition.events.filter(filterEventData).map(onMapEventData) || []
                    },
                    keys: {
                        text: "story_template.reportItems.keys",
                        data: vm.model.storyDefinition.variables && vm.model.storyDefinition.variables.filter(filterKeyData).map(onMapKeyData) || []
                    },
                    storyVariables: {
                        text: "story_template.reportItems.storyVariables",
                        data: vm.model.storyDefinition.variables && vm.model.storyDefinition.variables.filter(filterStoryVariable).map(onMapStoryVariable) || []
                    }
                };

                function onIterateReportStat(reportStat) {
                    if (!vm.reportItemList[reportStat.type]) {
                        vm.reportItemList[reportStat.type] = [];
                    }
                    if (reportStat.visible) {
                        vm.reportItemList[reportStat.type].push(reportStat.value);
                    }
                }

            }

            function onReportStatError(response) {
                console.log(response);
            }

            function filterActionData(item) {
                if (vm.hiddenItems["ACTION_COUNT"]) {
                    return vm.hiddenItems["ACTION_COUNT"].indexOf(item.actionTemplate) < 0;
                }
                return true;
            }

            function filterEventData(item) {
                if (vm.hiddenItems["EVENT_COUNT"]) {
                    return vm.hiddenItems["EVENT_COUNT"].indexOf(item.eventName) < 0;
                }
                return true;
            }

            function onMapActionData(item) {
                return {
                    value: item.actionName,
                    type: "actionCount",
                    visible: vm.reportItemList ? vm.reportItemList["actionCount"] && vm.reportItemList["actionCount"].indexOf(item.actionName) > -1 : true
                };
            }

            function onMapEventData(event) {
                return {
                    value: event.eventName,
                    type: "eventCount",
                    visible: vm.reportItemList ? vm.reportItemList["eventCount"] && vm.reportItemList["eventCount"].indexOf(event.eventName) > -1 : true
                };
            }

            function filterKeyData(item) {
                if (vm.hiddenItems["keyVar"]) {
                    return item.scope === "Key" && vm.hiddenItems["keyVar"].indexOf(item.name) < 0;
                }
                return item.scope === "Key";
            }

            function onMapKeyData(item) {
                return {
                    displayName: $filter('stringToObject')(item.extras).displayName,
                    value: item.name,
                    type: "keyVar",
                    visible: vm.reportItemList && vm.reportItemList["keyVar"] && vm.reportItemList["keyVar"].indexOf(item.name) > -1
                };
            }

            function filterReportVariable(item) {
                return item.scope === "Report";
            }

            function onMapReportVariable(item) {
                return {
                    value: item.name,
                    type: "reportVar",
                    visible: vm.reportItemList && vm.reportItemList["reportVar"] && vm.reportItemList["reportVar"].indexOf(item.name) > -1
                };
            }

            function filterStoryVariable(item) {
                if (vm.hiddenItems["storyVar"]) {
                    return item.scope === "Story" && vm.hiddenItems["storyVar"].indexOf(item.name) < 0;
                }
                return item.scope === "Story";
            }

            function onMapStoryVariable(item) {
                return {
                    displayName: $filter('stringToObject')(item.extras).displayName,
                    value: item.name,
                    type: "storyVar",
                    visible: vm.reportItemList && vm.reportItemList["storyVar"] && vm.reportItemList["storyVar"].indexOf(item.name) > -1
                };
            }

        }

    }
})(angular);

