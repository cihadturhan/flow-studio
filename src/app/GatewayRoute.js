/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('gatewayApp')
        .run(runHome);

    runHome.$inject = [
        'routerHelper'
    ];
    /* @ngInject */
    function runHome(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'gateway',
                config: {
                    url: '/gateway',
                    parent: 'app',
                    views: {
                        'content@': {
                            templateUrl: 'app/GatewayView.html',
                            controller: 'GatewayController',
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
        $translatePartialLoader.addPart('home');
    }
})(angular);

