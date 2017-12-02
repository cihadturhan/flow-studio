/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.dashboard')
        .run(runDashboard);

    runDashboard.$inject = [
        'routerHelper'
    ];
    /* @ngInject */
    function runDashboard(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'dashboard',
                config: {
                    url: '/dashboard',
                    parent: 'app',
                    data: {
                        pageTitle: 'dashboard.title',
                        parentTitles: [],
                        menu: {
                            parent: 'home',
                            visible: false
                        }
                    },
                    views: {
                        'content@': {
                            templateUrl: 'app/dashboard/DashboardView.html',
                            controller: 'DashboardController',
                            controllerAs: 'vm'
                        }
                    },
                    resolve: {
                        language: language
                    }
                }
            }
        ];
    }

    language.$inject = [
        '$translatePartialLoader'
    ];
    /* @ngInject */
    function language($translatePartialLoader) {
    }
})(angular);
