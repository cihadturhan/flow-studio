/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.flow')
        .run(runFlowDetail);

    runFlowDetail.$inject = [
        'routerHelper'
    ];
    /* @ngInject */
    function runFlowDetail(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'flow.detail',
                config: {
                    url: '/detail/{isDashboard}/{id}',
                    params: {
                        isDashBoard: {squash: true, value: 0},
                        id: {squash: true},
                        isDraft : {squash : true},
                        draftData: {squash : true}

                    },
                    data: {
                        pageTitle: 'flow.title',
                        currentBodyClass: 'sidebar-collapse',
                        menu: {
                            parent: 'app',
                            icon: 'crop',
                            text: 'layout.nav_bar.flows',
                            groupOrder: 1.5
                        }
                    },
                    views: {
                        'content@': {
                            templateUrl: 'app/flow/detail/FlowDetailView.html',
                            controller: 'FlowDetailController',
                            controllerAs: 'vm'
                        }
                    },
                    resolve: {
                        language: language,
                        model: loadModel,
                        isDashboard: isDashboard,
                        storyID: loadStoryID,
                        isDraft: isDraft,
                        draftData: loadDraftData
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
        $translatePartialLoader.addPart('flow');
    }

    loadModel.$inject = [
    ];
    /* @ngInject */
    function loadModel() {
        var model = {
            data : {
                storyTemplate : null,
                storyTemplateDiagram: null
            }
        };
        return model;

    }

    isDashboard.$inject = [
        '$stateParams'
    ];
    /* @ngInject */
    function isDashboard($stateParams){
        return Number($stateParams.isDashboard);
    }

    function loadStoryID($stateParams){
        return $stateParams.id;
    }

    function isDraft($stateParams){
        return Number($stateParams.isDraft);
    }

    function loadDraftData($stateParams){
        return $stateParams.draftData;
    }

})(angular);
