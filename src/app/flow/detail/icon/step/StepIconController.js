/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.flow')
        .controller('StepIconController', StepIconController);

    StepIconController.$inject = [
        '$scope',
        'model',
        'AutoFlowCanvasStory'
    ];
    /* @ngInject */
    function StepIconController($scope, model, AutoFlowCanvasStory) {
        var vm = this;

        vm.model = angular.copy(model);
        vm.oldUserData = angular.copy(vm.model.userData);
        vm.storyTemplate = AutoFlowCanvasStory.story.storyTemplate;

        vm.save = save;

        activate();

        /////////////////////////

        function activate() {

        }

        function save(){
            var step = vm.storyTemplate.storyDefinition.steps.find(onFindStep);
            if (step) {
                angular.forEach(vm.storyTemplate.storyDefinition.connections, onIterateConnection);
                step.name = vm.model.userData.name;
            } else {
                vm.storyTemplate.storyDefinition.steps.push(
                    {
                        name: vm.model.userData.name,
                        type: "Node",
                        actions: [],
                        maxVisitCount: 0
                    }
                )
            }

            ////////////////////

            function onFindStep(step){
                return vm.oldUserData && step.name === vm.oldUserData.name;
            }

            function onIterateConnection(connection){
                if(connection.sourceStep === vm.oldUserData.name){
                    connection.sourceStep = vm.model.userData.name
                }
                if(connection.targetStep === vm.oldUserData.name){
                    connection.targetStep = vm.model.userData.name
                }
            }

            $scope.closeThisDialog(vm.model);
        }

    }
})(angular);