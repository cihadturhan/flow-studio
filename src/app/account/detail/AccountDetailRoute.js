/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('account.detail')
        .run(runAccountDetail);

    runAccountDetail.$inject = [
        'routerHelper',
    ];
    /* @ngInject */
    function runAccountDetail(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'account.detail',
                config: {
                    url: '/detail',
                    parent: 'account',
                    views: {
                        'content@': {
                            templateUrl: 'app/account/detail/AccountDetailView.html',
                            controller: 'AccountDetailController',
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
        $translatePartialLoader.addPart('layout');
        $translatePartialLoader.addPart('global');
        $translatePartialLoader.addPart('account');
    }
})(angular);
