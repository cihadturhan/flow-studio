(function (angular) {
    'use strict';

    angular
        .module('app.account')
        .factory('Account', AccountFactory);

    AccountFactory.$inject = [
        '$resource',
        'API_URI'
    ];
    /* @ngInject */
    function AccountFactory($resource, API_URI) {
        return $resource(
            API_URI, {}, {
                getAccountInfo: {
                    url: API_URI + "/account/info",
                    method: "GET",
                    headers: {'Content-Type': 'application/json'}
                },
                getStoryList: {
                    url: API_URI + "/account/stories",
                    method: "GET",
                    headers: {'Content-Type': 'application/json'}
                },
                getStoryDetailList: {
                    url: API_URI + "/account/stories/details",
                    method: "GET",
                    headers: {'Content-Type': 'application/json'}
                },
                getStoryRequestedDetailList: {
                    url: API_URI + "/account/stories/requestedDetails",
                    method: "GET",
                    headers: {'Content-Type': 'application/json'}
                },
                getActionList: {
                    url: API_URI + "/account/actions",
                    method: "GET",
                    headers: {'Content-Type': 'application/json'}
                },
                getAccountVariables: {
                    url: API_URI + "/account/variables",
                    method: "GET",
                    headers: {'Content-Type': 'application/json'}
                },
                getAccountEventList: {
                    url: API_URI + "/account/events",
                    method: "GET",
                    headers: {'Content-Type': 'application/json'}
                },
                userLanguage: {
                    url: API_URI + "/user/detail",
                    method: "GET",
                    headers: {'Content-Type': 'application/json'}
                },
                insertEvent: {
                    url: API_URI + "/events/insert?storyID=:storyID",
                    method: "POST",
                    headers: {'Content-Type': 'application/json'}
                }
            }
        );
    }

})(angular);