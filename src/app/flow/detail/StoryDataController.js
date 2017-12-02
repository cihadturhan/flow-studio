/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.flow')
        .controller('StoryDataController', StoryDataController);

    StoryDataController.$inject = [
        '$scope',
        '$filter',
        'variableScope',
        'dataList',
        'editedDataIndex',
        'AutoFlowCanvasStory',
        'AlertService',
        'DATA_TYPES'
    ];

    /* @ngInject */
    function StoryDataController($scope, $filter, variableScope, dataList, editedDataIndex, AutoFlowCanvasStory, AlertService, DATA_TYPES) {
        var vm = this;

        vm.variableScope = variableScope;
        vm.dataList = dataList;
        vm.storyTemplate = AutoFlowCanvasStory.story.storyTemplate;
        vm.editedDataIndex = editedDataIndex;
        vm.dataTypes = DATA_TYPES;

        vm.save = save;
        vm.update = update;
        vm.cancel = cancel;
        vm.changedVariableIndexDef;

        activate();

        /////////////////////////

        function activate() {
            vm.model = {
                type: null,
                name: null,
                value: null,
                extras: null
            };
            if (vm.editedDataIndex > -1) {
                // copy edited data's value to vm.model
                var editedData = vm.dataList.variables.data[vm.variableScope].data[vm.editedDataIndex];
                vm.model = angular.copy(editedData);
                vm.model.extras = $filter('stringToObject')(vm.model.extras);
                // find storyDef variables' index to update when update button is clicked
                for (var i = 0; i < vm.storyTemplate.storyDefinition.variables.length; i++) {
                    var variable = vm.storyTemplate.storyDefinition.variables[i];
                    if (variable.name == editedData.name && variable.scope == editedData.scope) {
                        vm.changedVariableIndexDef = i;
                        break;
                    }
                }
            }
            switch (vm.variableScope) {
                case 'storyData':
                    vm.model.scope = "Story";
                    break;
                case 'dynamicData':
                    vm.model.scope = "Key";
                    break;
            }
        }

        function save(isValid) {
            if (isValid) {
                if (!checkExistenceOfData(false)) {
                    vm.model.name = Math.random().toString(36).substr(2, 16);
                    vm.model.extras = $filter('objectToString')(vm.model.extras);
                    vm.dataList.variables.data[vm.variableScope].data.push(vm.model);
                    vm.storyTemplate.storyDefinition.variables.push(vm.model);
                    $scope.closeThisDialog();
                } else {
                    AlertService.error("flow.errors.variable_already_added");
                }
            } else {
                AlertService.error("flow.errors.form_is_not_valid");
            }
        }

        function update(isValid) {
            if (isValid) {
                if (!checkExistenceOfData(true)) {
                    // update vm.dataList.variables.data
                    vm.model.extras = $filter('objectToString')(vm.model.extras);
                    vm.dataList.variables.data[vm.variableScope].data[vm.editedDataIndex] = vm.model;
                    // update vm.storyTemplate.storyDefinition.variables
                    vm.storyTemplate.storyDefinition.variables[vm.changedVariableIndexDef] = vm.model;
                    $scope.closeThisDialog();
                } else {
                    AlertService.error("flow.errors.variable_already_added");
                }


            } else {
                AlertService.error("flow.errors.form_is_not_valid");
            }

        }

        function checkExistenceOfData(isUpdate) {
            var isExist = false;
            for (var index = 0; index < vm.storyTemplate.storyDefinition.variables.length; index++) {
                var variable = vm.storyTemplate.storyDefinition.variables[index];
                if (variable.name == vm.model.name && variable.scope == vm.model.scope) {
                    isExist = true;
                    break;
                }
            }
            if (isUpdate) {
                return isExist && index != vm.changedVariableIndexDef;
            } else {
                return isExist;
            }
        }

        function cancel() {
            $scope.closeThisDialog();
        }
    }

})(angular);

