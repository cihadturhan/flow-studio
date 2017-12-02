/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('gatewayApp')
        .config(AppConfig);

    AppConfig.$inject = [
        '$resourceProvider'
    ];
    /* @ngInject */
    function AppConfig($resourceProvider,datetimepickerProvider) {
        $resourceProvider.defaults.actions = {};
    }
})(angular);
