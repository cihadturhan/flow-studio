/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .config(httpConfig);

    httpConfig.$inject = [
        '$httpProvider',
        '$urlRouterProvider',
        '$urlMatcherFactoryProvider'
    ];
    /* @ngInject */
    function httpConfig($httpProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
        $urlRouterProvider.otherwise('/');

        $httpProvider.interceptors.push('requestInterceptor');
        $httpProvider.interceptors.push('responseInterceptor');
        $httpProvider.interceptors.push('requestErrorInterceptor');
        $httpProvider.interceptors.push('responseErrorInterceptor');

        $urlMatcherFactoryProvider.type('boolean', {
            name: 'boolean',
            decode: function (val) {
                return val === true || val === 'true';
            },
            encode: function (val) {
                return val ? 1 : 0;
            },
            equals: function (a, b) {
                return this.is(a) && a === b;
            },
            is: function (val) {
                return [
                        true,
                        false,
                        0,
                        1
                    ].indexOf(val) >= 0;
            },
            pattern: /bool|true|0|1/
        });
    }
})(angular);
