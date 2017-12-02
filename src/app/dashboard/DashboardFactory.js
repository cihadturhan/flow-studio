/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.dashboard')
        .factory('Dashboard', DashboardFactory);

    DashboardFactory.$inject = ['$q', '$resource', 'API_URI'];
    /* @ngInject */
    function DashboardFactory($q, $resource, API_URI) {
        return $resource(
            API_URI, {}, {
                getStoryInfo: {
                    url: API_URI + "/stories/:storyID",
                    method: "GET",
                    headers: {'Content-Type': 'application/json'}
                },
                getCombinedStoryObjectList: {
                    url: API_URI + "/stories/combinedStoryObjectList",
                    method: "GET",
                    isArray: true,
                    headers: {'Content-Type': 'application/json'},
                    transformResponse: function (data) {
                        var response = angular.fromJson(data);
                        return response.data.filter(onFilterData);
                        //////////////
                        function onFilterData(item){
                            return item.storyInfo.status === 'deployed' || item.storyInfo.status === 'running';
                        }
                    }
                },
                getCombinedStoryObject: {
                    url: API_URI + "/stories/:storyID/combinedStoryObject",
                    method: "GET",
                    headers: {'Content-Type': 'application/json'}
                },
                postStoryStart: {
                    url: API_URI + "/stories/:storyID/start",
                    method: "PUT"
                },
                postStoryStop: {
                    url: API_URI + "/stories/:storyID/stop",
                    method: "PUT"
                },
                postStoryUndeploy: {
                    url: API_URI + "/stories/:storyID/undeploy",
                    method: "PUT"
                },
                getStoryEvents: {
                    url: API_URI + "/stories/:storyID/events",
                    method: "GET"
                }
            }
        );

        function createFormEncodedRequest(data, headersGetter) {
            var str = [];
            angular.forEach(data, onIterateData);

            //////////////////////
            function onIterateData(value, key) {
                str.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
            }

            return str.join("&");
        }
    }

})(angular);

