/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .factory('responseInterceptor', responseInterceptorFactory);

    responseInterceptorFactory.$inject = [
        '$q',
        '$rootScope',
        'AlertService'
    ];
    /* @ngInject */
    function responseInterceptorFactory($q, $rootScope, AlertService) {
        return {
            response: response
        };

        ////////////////

        function response(response) {
            if (response.status == 200) {
                if (response.data.status != undefined && response.data.status != 0 && response.data.status != 200) {
                    AlertService.error(response.data.message);
                    return $q.reject(response);
                }
            }
            return response;
        }
    }

})(angular);
