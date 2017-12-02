/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.flow')
        .service('AutoFlowCanvasStory', AutoFlowCanvasStoryService);

    AutoFlowCanvasStoryService.$inject = [];

    /* @ngInject */
    function AutoFlowCanvasStoryService() {
        var vm = this;

        vm.initialStory = initialStory;

        vm.storyOrig = {
            storyInfo: {},
            storyTemplateDiagram: [],
            storyTemplate: {
                templateID: "1eb04d98-b93c-494e-a221-930caf3f6ecf",
                havingDiagram: true,
                accountID: null,
                name: null,
                representation: {},
                filledParameters: [],
                storyDefinition: {
                    accountID: null,
                    storyID: null,
                    storyName: null,
                    storyType: 'business',
                    startDate: null,
                    stopDate: null,
                    rawDefinition: null,
                    hasStepCounter: false,
                    targetListName: null,
                    hasTargetList: false,
                    steps: [],
                    connections: [],
                    events: [],
                    rules: [],
                    actions: [],
                    variables: [],
                    reports: null,
                    reportItems: null,
                    prePostOperations: {}
                },
                localizationData: [],
                filledRules: [],
                autoFill: {
                    actions: [
                        {
                            templateName: "org.apache.flume.sink.actions.sendmail.SendMail",
                            params: [
                                {source: "CAMPAIGN_ID", dataService: "SmIntegration.getCampaignList.osm"},
                                {source: "TEMPLATE_ID", dataService: "SmIntegration.getTemplateList"}
                            ]
                        },
                        {
                            templateName: "org.apache.flume.sink.actions.sendsms.SendSms",
                            params: [
                                {source: "CAMPAIGN_ID", dataService: "SmIntegration.getCampaignList.osm"},
                                {source: "TEMPLATE_ID", dataService: "SmIntegration.getTemplateList"}
                            ]
                        },
                        {
                            templateName: "com.odc.sm.autoflow.engine.action.builtin.GenerateEventFromApi",
                            params: [
                                {source: "TARGET_STORY_ID", dataService: "SmIntegration.getStoryList"},
                                {source: "EVENT_NAME", dataService: "SmIntegration.getEventList"}
                            ]
                        }
                    ]
                },
                filter: {
                    actions: [
                        {
                            name: "org.apache.flume.sink.actions.sendmail.SendMail",
                            hidden: [
                                "VARIABLES",
                                "EXTERNAL_ID"
                            ]
                        },
                        {
                            name: "org.apache.flume.sink.actions.sendsms.SendSms",
                            hidden: [
                                "VARIABLES",
                                "EXTERNAL_ID"
                            ]
                        }
                    ]
                }
            }
    };

        initialStory();

        function initialStory(){
            vm.story = angular.copy(vm.storyOrig);
        }

    }
})(angular);
