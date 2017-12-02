/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .filter('enrichmentParameterName', EnrichmentParameterName);

    EnrichmentParameterName.$inject = [
        '$translate',
        'StorageHelper',
        'TRANSLATION_MODEL_TYPE'
    ];
    /*@ ngInject */
    function EnrichmentParameterName($translate, StorageHelper, TRANSLATION_MODEL_TYPE) {
        return enrichmentParameterName;

        ////////////////

        function enrichmentParameterName(enrichmentParamName, enrichmentName) {
            let obj = {
                name: enrichmentParamName,
                description: ""
            };

            let language = $translate.storage().get('NG_TRANSLATE_LANG_KEY');

            let translations = StorageHelper.getTranslation(TRANSLATION_MODEL_TYPE.ENRICHMENT, language);
            if (translations) {
                let translation = translations.find(onFindTranslation);
                if (translation && translation.value && translation.value.params) {
                    let translatedParam = translation.value.params.find(onFindParam);
                    if (translatedParam) {
                        obj.name = translatedParam.text;
                        obj.description = translatedParam.description;
                    }
                }
            }

            return obj;

            ////////////////////////

            function onFindTranslation(translation) {
                return translation.value.enrichmentName.key === enrichmentName;
            }

            function onFindParam(param) {
                return param.key === enrichmentParamName;
            }
        }
    }

})(angular);
