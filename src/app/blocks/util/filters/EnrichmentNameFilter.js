/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .filter('enrichmentName', EnrichmentName);

    EnrichmentName.$inject = [
        '$translate',
        'StorageHelper',
        'TRANSLATION_MODEL_TYPE'
    ];
    /*@ ngInject */
    function EnrichmentName($translate, StorageHelper, TRANSLATION_MODEL_TYPE) {
        return enrichmentName;

        ////////////////

        function enrichmentName(enrichmentName) {
            let obj = {
                name: enrichmentName,
                description: ""
            };

            let language = $translate.storage().get('NG_TRANSLATE_LANG_KEY');
            let translations = StorageHelper.getTranslation(TRANSLATION_MODEL_TYPE.ENRICHMENT, language);
            if (translations) {
                let translation = translations.find(onFindTranslation);
                if (translation) {
                    obj.name = translation.value.enrichmentName.text;
                    obj.description = translation.value.description;
                }
            }

            return obj;

            ////////////////////////

            function onFindTranslation(translation) {
                return translation.value.enrichmentName.key === enrichmentName;
            }
        }
    }

})(angular);
