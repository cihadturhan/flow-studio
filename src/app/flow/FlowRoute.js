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
                state: 'flow',
                config: {
                    url: '/flows',
                    parent: 'app',
                    data: {
                        pageTitle: 'flow.title'
                    },
                    views: {
                        'content@': {
                            templateUrl: 'app/flow/FlowView.html',
                            controller: 'FlowController',
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
        $translatePartialLoader.addPart('flow');
        $translatePartialLoader.addPart('storyTemplate');
    }
})(angular);

