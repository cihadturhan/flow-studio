/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.account')
        .run(runEnrichment);

    runEnrichment.$inject = [
        'routerHelper'
    ];
    /* @ngInject */
    function runEnrichment(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'account',
                config: {
                    url: '/accounts',
                    parent: 'app',
                    abstract: true,
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
        $translatePartialLoader.addPart('token');
    }
})(angular);
