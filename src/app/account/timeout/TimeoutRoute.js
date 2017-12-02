/**
 * Developed by Sinan Dirlik (sinan.dirlik@odc.com.tr)
 */

(function (angular) {
    'use strict';

    angular.module('account.timeout')
        .run(runLogin);

    runLogin.$inject = ['routerHelper'];
    /* @ngInject */
    function runLogin(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'timeout',
                config: {
                    url: '/timeout',
                    parent: 'account',
                    data: {
                        currentBodyClass: "login-page",
                        pageTitle: 'layout.nav_bar.login'
                    },
                    views: {
                        'content@': {
                            templateUrl: 'app/account/timeout/TimeoutView.html',
                            controller: 'TimeoutController',
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
