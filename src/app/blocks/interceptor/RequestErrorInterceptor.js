/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .factory('requestErrorInterceptor', requestErrorInterceptorFactory);

    requestErrorInterceptorFactory.$inject = [
        '$rootScope'
    ];
    /* @ngInject */
    function requestErrorInterceptorFactory($rootScope) {
        return {
            requestError: requestError
        };

        ////////////////

        function requestError(rejection) {
            return rejection;
        }
    }

})(angular);
