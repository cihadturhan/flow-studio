/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .factory('responseErrorInterceptor', responseErrorInterceptorFactory);

    responseErrorInterceptorFactory.$inject = [
        '$q',
        '$rootScope'
    ];
    /* @ngInject */
    function responseErrorInterceptorFactory($q, $rootScope) {
        return {
            responseError: responseError
        };

        ////////////////

        function responseError(response) {
            if (!angular.isObject(response.config) || response.config.broadcast !== false) {
                $rootScope.$emit('gatewayApp.httpError', response);
                if (response.status === 401) {
                    $rootScope.$broadcast('unauthorized');
                }
            }
            return $q.reject(response);
        }
    }

})(angular);
