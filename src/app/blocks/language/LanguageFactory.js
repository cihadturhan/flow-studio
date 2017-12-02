/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .factory('Language', LanguageFactory);

    LanguageFactory.$inject = [
        '$q',
        '$translate',
        'LANGUAGES'
    ];
    /* @ngInject */
    function LanguageFactory($q, $translate, LANGUAGES) {
        return {
            getAll: getAll,
            getCurrent: getCurrent
        };

        ////////////////////////

        function getAll() {
            var deferred = $q.defer();
            deferred.resolve(LANGUAGES);
            return deferred.promise;
        }

        function getCurrent() {
            var deferred = $q.defer();
            var language = $translate.storage().get('NG_TRANSLATE_LANG_KEY');

            deferred.resolve(language);

            return deferred.promise;
        }
    }
})(angular);
