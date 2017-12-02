/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.flow')
        .controller('EventLabelController', EventLabelController);

    EventLabelController.$inject = [
        '$scope',
        '$rootScope',
        'model',
        'Account',
        'AlertService',
        'AutoFlowCanvasStory'
    ];
    /* @ngInject */
    function EventLabelController($scope, $rootScope, model, Account, AlertService, AutoFlowCanvasStory) {
        var vm = this;

        vm.model = model;
        vm.oldUserData = angular.copy(vm.model.userData);
        vm.storyTemplate = AutoFlowCanvasStory.story.storyTemplate;

        vm.save = save;

        activate();

        /////////////////////////

        function activate() {
            vm.eventList = [
                {
                    "eventName": "MEMBERREGISTER",
                    "eventType": "External",
                    "params": [
                        {
                            "name": "memberId",
                            "type": "String",
                            "required": false
                        },
                        {
                            "name": "email",
                            "type": "String",
                            "required": false
                        }
                    ]
                }
            ];

            //////////////////////

        }

        function save() {
            $scope.closeThisDialog(vm.model);
        }

    }
})(angular);