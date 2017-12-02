/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.home')
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
                state: 'home',
                config: {
                    url: '/',
                    parent: 'app',
                    views: {
                        'content@': {
                            templateUrl: 'app/home/HomeView.html',
                            controller: 'HomeController',
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

