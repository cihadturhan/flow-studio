/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .config(translateConfig);

    translateConfig.$inject = [
        '$translateProvider',
        'tmhDynamicLocaleProvider'
    ];
    /* @ngInject */
    function translateConfig($translateProvider, tmhDynamicLocaleProvider) {
        // Initialize angular-translate
        $translateProvider.useLoader(
            '$translatePartialLoader', {
                urlTemplate: '/i18n/{lang}/{part}.json'
            }
        );

        $translateProvider.preferredLanguage('tr');
        $translateProvider.useStorage('translationStorageProvider');
        $translateProvider.useSanitizeValueStrategy('escaped');
        $translateProvider.addInterpolation('$translateMessageFormatInterpolation');
        $translateProvider.forceAsyncReload(true);

        tmhDynamicLocaleProvider.localeLocationPattern('/i18n/angular-locale_{{locale}}.js');
        tmhDynamicLocaleProvider.useCookieStorage();
        tmhDynamicLocaleProvider.storageKey('NG_TRANSLATE_LANG_KEY');
    }
})(angular);
