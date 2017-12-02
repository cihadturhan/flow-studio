/**
 * Developed by Serdar Yiğit (serdar.yigit@odc.com.tr)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .service('IntegrationDispatcher', IntegrationDispatcherService);

    IntegrationDispatcherService.$inject = ['$q', 'SmIntegration'];
    /* @ngInject */
    function IntegrationDispatcherService($q, SMIntegration) {
        var vm = this;

        vm.dispatch = dispatch;
        /////////////////////
        function dispatch(name, queryParam, bodyParam) {
            var defer = $q.defer();

            switch (name) {
                case "SmIntegration.getCampaignList":
                    // We choice default campaign method
                    queryParam['method'] = "STD";
                    SMIntegration.getCampaignList(queryParam, bodyParam, onSuccessResult, onErrorResult).$promise;
                    break;

                case "SmIntegration.getCampaignList.osm":
                    queryParam['method'] = "OSM";
                    SMIntegration.getCampaignList(queryParam, bodyParam, onSuccessResult, onErrorResult).$promise;
                    break;

                case "SmIntegration.getCampaignList.std":
                    queryParam['method'] = "STD";
                    SMIntegration.getCampaignList(queryParam, bodyParam, onSuccessResult, onErrorResult).$promise;
                    break;

                case "SmIntegration.getCampaignLinkList":
                    SMIntegration.getCampaignLinkList(queryParam, bodyParam, onSuccessResult, onErrorResult).$promise;
                    break;

                case "SmIntegration.getTemplateList":
                    SMIntegration.getTemplateList(queryParam, bodyParam, onSuccessResult, onErrorResult).$promise;
                    break;

                case "SmIntegration.getMemberFields":
                    SMIntegration.getMemberFields(queryParam, bodyParam, onSuccessResult, onErrorResult).$promise;
                    break;

            }

            /////////////////

            function onSuccessResult(result) {
                defer.resolve(result);
            }

            function onErrorResult(error) {
                defer.reject();
            }

            return defer.promise;
        }

    }

})(angular);


