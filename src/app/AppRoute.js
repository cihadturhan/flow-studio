/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('gatewayApp')
        .run(runApp);

    runApp.$inject = ['routerHelper'];
    /* @ngInject */
    function runApp(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'app',
                config: {
                    abstract: true,
                    data: {
                        authorities: [],
                        pageTitle: 'global.title'
                    },
                    views: {
                        'menu@': {
                            templateUrl: 'app/layouts/navigation-bar/NavigationBarView.html',
                            controller: 'NavigationBarController',
                            controllerAs: 'vm'
                        }
                    },
                    resolve: {
                        initialization: initialization,
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
        $translatePartialLoader.addPart('global');
        $translatePartialLoader.addPart('layout');
    }

    initialization.$inject = [
        '$rootScope',
        '$state',
        '$stateParams'
    ];
    /* @ngInject */
    function initialization($rootScope, $state, $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
    }
})(angular);
