/**
 * Developed by Serdar Yiğit(serdar.yigit@odc.com.tr)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.dashboard')
        .run(runDashboardDetail);

    runDashboardDetail.$inject = [
        'routerHelper'
    ];
    /* @ngInject */
    function runDashboardDetail(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'dashboard.detail',
                config: {
                    url: '/detail/{storyID}',
                    parent: 'dashboard',
                    data: {
                        parentTitles: ['dashboard.title'],
                        menu: {
                            parent: 'home',
                            visible: false
                        }
                    },
                    views: {
                        'content@': {
                            templateUrl: 'app/story-template/detail/StoryDetailView.html',
                            controller: 'StoryDetailController',
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
        $translatePartialLoader.addPart('dashboard');
        $translatePartialLoader.addPart('storyTemplate');
    }
})(angular);
