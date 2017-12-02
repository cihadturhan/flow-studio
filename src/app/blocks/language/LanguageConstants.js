/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')

        /*
         Languages codes are ISO_639-1 codes, see http://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
         They are written in English to avoid character encoding issues (not a perfect solution)
         */
        .constant(
            'LANGUAGES', [
                'en',
                'tr',
                'ar'
                // jhipster-needle-i18n-language-constant - JHipster will add/remove languages in this array
            ]
        )
        .constant(
            'RIGHT_TO_LEFT_LANGUAGES', [
                'ar'
            ]
        );
})(angular);
