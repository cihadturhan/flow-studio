/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .filter('findLanguageFromKey', findLanguageFromKey);

    function findLanguageFromKey() {
        return findLanguageFromKeyFilter;

        ////////////////////

        function findLanguageFromKeyFilter(lang) {
            return {
                'en': 'English',
                'tr': 'Türkçe',
                'ar': 'العربية'
            }[lang];
        }
    }
})(angular);
