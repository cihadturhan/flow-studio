/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module(
            'gatewayApp', [
                'ui.router',
                'ngCookies',
                'ngMessages',
                'ngStorage',
                'ngSanitize',
                'ngDialog',
                'ngResource',
                'base64',
                'ae-datetimepicker',
                'tmh.dynamicLocale',
                'pascalprecht.translate',
                'angular-bind-html-compile',
                'ui.bootstrap',
                'app.account',
                'app.blocks',
                'app.layout',
                'app.home',
                'app.flow',
                '720kb.tooltips'
            ]
        )
        .run(run);

    run.$inject = [
        'StateHandler',
        'TranslationHandler'
    ];
    /* @ngInject */
    function run(StateHandler, TranslationHandler) {
        StateHandler.initialize();
        TranslationHandler.initialize();
    }
})(angular);
