/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .factory('translationStorageProvider', translationStorageProviderFactory);

    translationStorageProviderFactory.$inject = [
        '$cookies',
        '$log',
        'LANGUAGES'
    ];
    /* @ngInject */
    function translationStorageProviderFactory($cookies, $log, LANGUAGES) {
        return {
            get: get,
            put: put
        };

        ////////////////

        function get(name) {
            if (LANGUAGES.indexOf($cookies.getObject(name)) === -1) {
                $log.info(
                    'Resetting invalid cookie language "' + $cookies.getObject(name) + '" to prefered language' + ' "tr"'
                );
                $cookies.putObject(name, 'tr');
            }
            return $cookies.getObject(name);
        }

        function put(name, value) {
            $cookies.putObject(name, value);
        }
    }

})(angular);
