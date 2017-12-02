/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = [
        '$timeout',
        '$rootScope',
        '$state',
        'Dashboard'
    ];
    /* @ngInject */
    function DashboardController($timeout, $rootScope, $state, Dashboard) {

        var vm = this;

        vm.filter = "";
        vm.combinedStories = [];
        // TODO : will be removed after category merge
        vm.categoryEnabled = false;
        vm.sortList = [
            {
                text: "dashboard.sort.start_date",
                value: "storyTemplate.storyDefinition.startDate"
            },
            {
                text: "dashboard.sort.stop_date",
                value: "storyTemplate.storyDefinition.stopDate"
            }
        ];
        vm.order = vm.sortList[0];
        vm.sortArrow = 'up';


        vm.onChangeSortArrow = onChangeSortArrow;

        activate();

        //////////////////////////////

        function activate() {

        }

        function onChangeSortArrow() {
            if (vm.sortArrow === 'up') {
                vm.sortArrow = 'down';
                vm.order.value = '-' + vm.order.value;
            } else {
                vm.sortArrow = 'up';
                if (vm.order.value.startsWith('-')) {
                    vm.order.value = vm.order.value.slice(1, vm.order.value.length);
                }
            }
        }

    }


})(angular);
