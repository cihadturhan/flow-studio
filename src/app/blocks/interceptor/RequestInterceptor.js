/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .factory('requestInterceptor', requestInterceptorFactory);

    requestInterceptorFactory.$inject = [
        '$base64',
        '$cookies',
        '$rootScope'
    ];
    /* @ngInject */
    function requestInterceptorFactory($base64, $cookies, $rootScope) {
        return {
            request: request
        };

        ////////////////

        function request(config) {
            config.headers = config.headers || {};
            var token = getCurrentUserToken();
            if (token) {
                config.headers['Auth-token'] = token;
            }
            return config;
        }

        function getCurrentUserToken() {
            return $cookies.get('_rmmbr') ? angular.fromJson($base64.decode($cookies.get('_rmmbr'))).token : undefined;
        }
    }

})(angular);
