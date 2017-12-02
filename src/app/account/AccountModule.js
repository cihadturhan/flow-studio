/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module(
            'app.account', [
                'account.login',
                'account.detail',
                'account.timeout'
            ]
        );

})(angular);
