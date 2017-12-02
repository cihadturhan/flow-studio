/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .factory('Translation', TranslationFactory);

    TranslationFactory.$inject = [
        '$resource',
        'API_URI'
    ];
    /* @ngInject */
    function TranslationFactory($resource, API_URI) {
        return $resource(
            API_URI , {}, {
                getTranslations: {
                    method: 'GET',
                    url: API_URI + "/translation"
                }
            }
        );
    }

})(angular);
