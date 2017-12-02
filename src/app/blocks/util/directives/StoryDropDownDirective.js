/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .directive('storyDropDown', storyDropDown);

    storyDropDown.$inject = ['$document'];

    /* @ngInject */
    function storyDropDown($document) {
        return {
            bindToController: true,
            controller: StoryDropDownController,
            controllerAs: 'vm',
            restrict: 'E',
            templateUrl: 'app/blocks/util/directives/StoryDropDownView.html',
            scope: {
                data: '=',
                model: '=ngModel',
                anchor: '=anchor',
                isEditOn: '=editOn',
                autoFill: '=autoFill',
                isLeft: '=isLeft',
                ruleItem: '=ruleItem',
                operation: '=operation',
                readonly: '=ngReadonly',
                ruleGroupIndex: '=ruleGroupIndex',
                ruleItemIndex: '=ruleItemIndex',
                ruleItems: '=ruleItems',
                hasOperator: '=hasOperator',
                enrichmentData: '=enrichmentData',
                prePostOperations: '=prePostOperations',
                selectedEnrichment: '=selectedEnrichment',
                loading: '=loading'
            },
            link: function (scope, element, attrs) {
                scope.$watch('enrichmentData', function (newVal) {
                    if (newVal) {
                    }
                }, true);

                // It's for close the dropdown menu when click outside of dropdown
                $document.bind('click', onClick);
                //angular.element($window).off('click', onClick);


                scope.$on('$destroy', function () {
                    $document.off('click', onClick);
                });

                /////////////////////

                function onClick(event) {
                    var isClickedElementChildOfPopup = element.find(event.target).length > 0;

                    if (isClickedElementChildOfPopup)
                        return;

                    scope.vm.isOpen = false;
                    scope.$apply();
                }
            }
        };
    }


    //////////////////


    StoryDropDownController.$inject = [
        '$scope',
        '$filter',
        '$timeout',
        'ExpressionUtils',
        'IntegrationDispatcher'
    ];

    /* @ngInject */
    function StoryDropDownController($scope, $filter, $timeout, ExpressionUtils, IntegrationDispatcher) {
        var vm = this;

        vm.back = back;
        vm.click = click;
        vm.onKeyListener = onKeyListener;
        vm.setOperand = setOperand;
        vm.selectEnrichmentData = selectEnrichmentData;
        vm.setMultipleParameter = setMultipleParameter;
        vm.setOperandForMultiple = setOperandForMultiple;
        vm.selectParentParameter = selectParentParameter;
        vm.setEnrichmentDataParameter = setEnrichmentDataParameter;

        activate();

        ////////////////////////

        function activate() {
            $timeout(function () {
                onReadyDocument();
            });

            ///////////////////////

            function onReadyDocument() {
                vm.dataList = angular.copy(vm.data);
                if (vm.enrichmentData) {
                    vm.dataList['enrichmentData'] = vm.enrichmentData;
                    if (vm.model && vm.model.name && vm.model.name.split("~||~").length == 3) {
                        var name = vm.model.name.split("~||~")[0];
                        var type = vm.model.name.split("~||~")[1];
                        angular.forEach(vm.dataList.enrichmentData.data[type], onIterateEnrichmentData);
                        vm.model.value = vm.model.name;
                        vm.model.name = name;
                    }
                }

                ///////////////////
                function onIterateEnrichmentData(enrichment) {
                    if (enrichment.name === name) {
                        vm.selectedEnrichmentData = enrichment;
                    }
                }
            }
        }

        function click() {
            if (!vm.isOpen) {
                // It is initializing with empty values for static variables
                // TODO We need to improve for autofill data..
                //vm.model = {name: "", value: "", scope: "static"};
                if (vm.autoFill && !vm.isLeft) {
                    var bodyParam = {};
                    var queryParam = {};
                    var autoFill = vm.autoFill.find(onFindAutoFill);
                    if (autoFill) {
                        if (autoFill.dependency) {
                            var rowIndex = vm.anchor.map(onMapAnchor).indexOf(autoFill.dependency);
                            if (rowIndex !== -1 && vm.ruleItems[rowIndex].rightOperand.value) {
                                // spinner in input box
                                vm.loading = "loading";
                                // TODO queryParam should be dynamic not static value
                                queryParam['campaignID'] = vm.ruleItems[rowIndex].rightOperand.value;
                                IntegrationDispatcher.dispatch(autoFill.dataService, queryParam, bodyParam).then(onResultDispatch, onErrorDispatch);
                            }
                        } else {
                            // spinner in input box
                            vm.loading = "loading";
                            IntegrationDispatcher.dispatch(autoFill.dataService, queryParam, bodyParam).then(onResultDispatch, onErrorDispatch);
                        }
                        return;
                    }
                }
            }

            vm.isInnerParametersShow = {};
            vm.isParentParametersShow = undefined;
            vm.enrichmentDataParentMenuShow = false;
            vm.selectedEnrichmentData = undefined;
            vm.isOpen = !vm.isOpen;

            /////////////////////

            function onFindAutoFill(autoFill) {
                return autoFill.source == vm.anchor[vm.ruleItemIndex].leftOperand;
            }

            function onResultDispatch(result) {
                if (result && Object.keys(result).length > 0) {
                    var key = Object.keys(result)[0];
                    vm.dataList[key] = result[key];
                    selectParentParameter(key, true);
                    vm.isOpen = vm.isOpen ? false : true;
                    vm.loading = "";
                }
            }

            function onErrorDispatch(e) {
                vm.loading = "";
            }

            function onMapAnchor(anchor) {
                return anchor.leftOperand;
            }

        }

        function onKeyListener() {
            if (!vm.model) {
                vm.model = {};
            }
            vm.model.scope = "Static";
            vm.model.type = "";
            if (vm.autoFill && !vm.isLeft) {
                vm.autoFillSearch = vm.model.name;
            }
            delete vm.model.value;
        }

        function setOperand(key, data, param, parentIndex, name) {
            if (key.toUpperCase() === 'eventData'.toUpperCase()) {
                param.name = $filter('eventParameterName')(param.name, data[0].name).name;
            } else if (key.toUpperCase() === 'dynamicData'.toUpperCase() || key.toUpperCase() === 'storyData'.toUpperCase()) {
                let extras = $filter('stringToObject')(param.extras);
                if(extras && extras.displayName){
                    param.extras = {
                        displayName: extras.displayName,
                        key: param.name
                    };
                    param.name = param.extras.displayName;
                    param.extras = $filter('objectToString')(param.extras);
                }
            }
            if (vm.readonly && vm.hasOperator) {
                vm.anchor[vm.ruleItemIndex] = {leftOperand: key};
                if (key === 'eventData') {
                    vm.anchor[vm.ruleItemIndex].leftOperand += "." + data[0].name;
                }
                vm.anchor[vm.ruleItemIndex].leftOperand += "." + param.name;
            }

            if (name) {
                var model = angular.copy(param);
                model.name = name;
                vm.model = model;
            } else {
                vm.isOpen = false;
                vm.isParentParametersShow = undefined;
                vm.isInnerParametersShow[key] = false;
                vm.model = param;
            }
            if (vm.autoFill) {
                var autoFill = vm.autoFill.find(onFindAutoFill);
                if (vm.isLeft) {
                    if (autoFill) {
                        vm.model.availableOperators = autoFill.operators;
                    } else {
                        vm.model.availableOperators = null;
                    }
                }
                if (vm.prePostOperations) {
                    if (autoFill) {
                        var anchorList = autoFill.source.split(".");
                        angular.forEach(vm.prePostOperations, onIteratePrePost);
                    }
                }
            }


            ////////////////////////

            function onFindAutoFill(autoFill) {
                return autoFill.source == vm.anchor[vm.ruleItemIndex].leftOperand;
            }

            function onIteratePrePost(value, key) {
                angular.forEach(value, onIterateValue);

                //////////////

                function onIterateValue(value) {
                    if (value.operParams && value.operParams.eventList) {
                        angular.forEach(value.operParams.eventList, onIterateEvent);
                    }

                    //////////////

                    function onIterateEvent(event) {
                        if (!event.jobList) {
                            event.jobList = [{}];
                        }
                        angular.forEach(event.jobList, onIterateJob);


                        /////////////////

                        function onIterateJob(job) {
                            job[autoFill.target] = [
                                'in',
                                'not in'
                            ].indexOf(vm.ruleItem.operation) === -1 ? param.value : param.value.split(",");
                        }
                    }
                }
            }
        }

        function setOperandForMultiple(key, data, param, parentIndex) {
            if (vm.readonly) {
                vm.anchor[vm.ruleItemIndex] = {leftOperand: key};
                if (key === 'eventData') {
                    vm.anchor[vm.ruleItemIndex].leftOperand += "." + data[0].name;
                }
                vm.anchor[vm.ruleItemIndex].leftOperand += "." + data[0].params.filter(function (d) {
                        return d.selected
                    }).map(function (d) {
                        return d.name
                    }).join();
            }
            param.selected = !param.selected;
            var name = data[0].params.filter(function (d) {
                return d.selected
            }).map(function (d) {
                return d.name
            }).join();
            param.value = data[0].params.filter(function (d) {
                return d.selected
            }).map(function (d) {
                return d.value
            }).join();

            setOperand(key, data, param, parentIndex, name);
        }

        function selectParentParameter(key, isAutoFill) {
            vm.isParentParametersShow = false;
            vm.isInnerParametersShow = {};
            vm.isInnerParametersShowForMultiple = {};
            if (key === 'enrichmentData') {
                vm.enrichmentDataParentMenuShow = true;
            }
            else if (isAutoFill && vm.operation && (vm.operation === 'in' || vm.operation === 'not in')) {
                vm.isInnerParametersShowForMultiple = {};
                vm.isInnerParametersShowForMultiple[key] = true;
                vm.isParentParametersShow = false;
            } else {
                vm.isInnerParametersShow = {};
                vm.isInnerParametersShow[key] = true;
                vm.isParentParametersShow = false;
            }
        }

        function selectEnrichmentData(enricmentData, type) {
            vm.enrichmentDataParentMenuShow = false;
            vm.selectedEnrichmentData = angular.copy(enricmentData);
            vm.selectedEnrichmentData.menuShow = true;
            vm.selectedEnrichmentData.type = type;
        }

        function setMultipleParameter() {
            if (vm.autoFill && vm.prePostOperations) {
                var autoFill = vm.autoFill.find(onFindAutoFill);
                if (autoFill) {
                    var anchorList = autoFill.source.split(".");
                    angular.forEach(vm.prePostOperations, onIteratePrePost);
                }

            }

            ////////////////////////

            function onFindAutoFill(autoFill) {
                return autoFill.source == vm.anchor[vm.ruleItemIndex].leftOperand;
            }

            function onIteratePrePost(value, key) {
                angular.forEach(value, onIterateValue);

                //////////////

                function onIterateValue(value) {
                    if (value.operParams && value.operParams.eventList) {
                        angular.forEach(value.operParams.eventList, onIterateEvent);
                    }

                    //////////////

                    function onIterateEvent(event) {
                        if (event.eventType && event.eventType.toLowerCase() == anchorList[1].toLowerCase()) {

                            angular.forEach(event.jobList, onIterateJob);

                        }

                        /////////////////

                        function onIterateJob(job) {
                            if (job.hasOwnProperty(autoFill.target)) {
                                job[autoFill.target] = [
                                    'in',
                                    'not in'
                                ].indexOf(vm.ruleItem.operation) === -1 ? vm.model.name : vm.model.name.split(",");
                            }
                        }
                    }
                }
            }
        }

        function setEnrichmentDataParameter() {
            if (vm.selectedEnrichmentData.type === "RESTCALL") {
                var method = vm.selectedEnrichmentData.definition.method;
                angular.forEach(vm.selectedEnrichmentData.definition.methodParameters, onIterateMethodParameter);
                var query = vm.selectedEnrichmentData.definition.query;
                angular.forEach(vm.selectedEnrichmentData.definition.queryParameters, onIterateQueryParameter);
                if (vm.selectedEnrichmentData.definition.methodParameters.length == 0) {
                    method = "'" + method + "'";
                }
                if (vm.selectedEnrichmentData.definition.queryParameters.length == 0) {
                    query = "'" + query + "'";
                }
                query = method + " + " + query;
            } else {
                var query = vm.selectedEnrichmentData.definition.query;
                angular.forEach(vm.selectedEnrichmentData.definition.parameters, onIterateParameter);
                query = "\"" + query + "\"";
            }


            vm.model = {
                name: vm.selectedEnrichmentData.name,
                type: vm.selectedEnrichmentData.returnType,
                value: vm.selectedEnrichmentData.name + "~||~" + vm.selectedEnrichmentData.type + "~||~" + Math.random().toString(36).substr(2, 16),
                scope: "ActionCall"
            };

            var action = {
                "actionName": vm.model.value,
                "actionTemplate": vm.selectedEnrichmentData.type === "RESTCALL" ? "com.odc.sm.autoflow.engine.action.builtin.ExecuteRestCall" : "com.odc.sm.autoflow.engine.action.builtin.ExecuteDbQuery",
                "actionType": "internal",
                "params": [
                    {
                        "name": vm.selectedEnrichmentData.type === "RESTCALL" ? "endPointName" : "connectionName",
                        "value": vm.selectedEnrichmentData.definition.dataSource,
                        "type": "String",
                        "scope": "Static"
                    },
                    {
                        "name": vm.selectedEnrichmentData.type === "RESTCALL" ? "method" : "query",
                        "value": query,
                        "type": "String",
                        "scope": "Static"
                    }
                ]
            };
            if (vm.selectedEnrichmentData.type === "RESTCALL") {
                action.params.push({
                    "name": "type",
                    "value": vm.selectedEnrichmentData.definition.type,
                    "type": "String",
                    "scope": "Static"
                });
            }
            vm.selectedEnrichment = action;
            vm.enrichmentDataParentMenuShow = false;
            vm.selectedEnrichmentData.menuShow = false;

            /////////////////////

            function onIterateMethodParameter(parameter, index) {
                var expression = ExpressionUtils.createExpression(parameter.enteredValue);
                if (!method.startsWith("'")) {
                    method = "'" + method;
                }
                if (parameter.enteredValue.scope !== 'static') {
                    expression = "' + " + expression;
                    if (method.trim().indexOf("?") !== method.trim().lastIndexOf("?")) {
                        expression = expression + " + '";
                    }
                }
                method = method.replace("?", expression);
                if (angular.lowercase(parameter.enteredValue.scope) == 'static' && vm.selectedEnrichmentData.definition.methodParameters.length - 1 == index) {
                    method += "'";
                }
            }

            function onIterateQueryParameter(parameter, index) {
                var expression = ExpressionUtils.createExpression(parameter.enteredValue);
                if (!query.startsWith("'")) {
                    query = "'" + query;
                }
                if (parameter.enteredValue.scope !== 'static') {
                    expression = "' + " + expression;
                    if (query.trim().indexOf("?", query.trim().indexOf("?") + 1) !== query.trim().lastIndexOf("?")) {
                        expression = expression + " + '";
                    }
                }
                query = query.replace(/(\w+=)(\?)/i, onReplace);

                if (angular.lowercase(parameter.enteredValue.scope) == 'static' && vm.selectedEnrichmentData.definition.queryParameters.length - 1 == index) {
                    query += "'";
                }

                ////////////////////

                function onReplace(text, $1, $2) {
                    return $1 + $2.replace("?", expression);
                }
            }

            function onIterateParameter(parameter, index) {
                var expression = ExpressionUtils.createExpression(parameter.enteredValue);

                if (expression.indexOf("getInteger") > -1) {
                    expression += ".toString()";
                }

                if (angular.lowercase(parameter.enteredValue.scope) === 'static' && typeof expression === 'string') {
                    expression = "'" + expression + "'";
                    query = query.replace("?", expression);
                } else {
                    expression = "'\" + " + expression + " + \"'";
                    query = query.replace("?", expression);
                }
            }

        }

        function back(key) {
            vm.isOpen = true;
            vm.isParentParametersShow = undefined;
            vm.isInnerParametersShow[key] = false;
            vm.isInnerParametersShowForMultiple[key] = false;
            vm.enrichmentDataParentMenuShow = false;
            vm.selectedEnrichmentData = null;
        }


    }
})(angular);
