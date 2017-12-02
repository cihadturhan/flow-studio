/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('gatewayApp')
        .constant(
            'MODAL', {
                closeTimeout: 1000,
                alertTimeout: 5000
            }
        )
        .constant(
            'NOTIFICATION', {
                interval: 15000
            }
        )
        .constant(
            'STORAGE', {
                translation: 'translation',
                operators: 'operators'
            }
        );

})(angular);