/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .controller('LanguageController', LanguageController);

    LanguageController.$inject = [
        '$translate',
        '$rootScope',
        'Language',
        'tmhDynamicLocale',
        'RIGHT_TO_LEFT_LANGUAGES'
    ];
    /* @ngInject */
    function LanguageController($translate, $rootScope, Language, tmhDynamicLocale, RIGHT_TO_LEFT_LANGUAGES) {
        var vm = this;

        vm.changeLanguage = changeLanguage;
        vm.languages = null;

        activate();

        //////////////////////

        function activate() {
            Language.getAll().then(
                function (languages) {
                    vm.languages = languages;
                }
            );

        }

        function changeLanguage(languageKey) {
            $translate.use(languageKey);
            tmhDynamicLocale.set(languageKey);
            var element = angular.element('html');
            if (RIGHT_TO_LEFT_LANGUAGES.indexOf(languageKey) > -1) {
                element.attr('dir', 'rtl');
            } else {
                element.attr('dir', 'ltr');
            }
            $rootScope.$broadcast('gatewayApp.changeLanguageSuccess');
        }
    }

})(angular, moment);
