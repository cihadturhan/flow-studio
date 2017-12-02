/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular.module('account.login')
        .run(runLogin);

    runLogin.$inject = ['routerHelper'];
    /* @ngInject */
    function runLogin(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'login',
                config: {
                    url: '/login',
                    parent: 'account',
                    data: {
                        currentBodyClass: "login-page",
                        pageTitle: 'layout.nav_bar.login'
                    },
                    views: {
                        'content@': {
                            templateUrl: 'app/account/login/LoginView.html',
                            controller: 'LoginController',
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
        $translatePartialLoader.addPart('global');
        $translatePartialLoader.addPart('layout');
        $translatePartialLoader.addPart('login');
    }
})(angular);
