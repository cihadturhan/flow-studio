/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .filter('eventParameterName', EventParameterName);

    EventParameterName.$inject = [
        '$translate',
        'StorageHelper',
        'TRANSLATION_MODEL_TYPE'
    ];
    /*@ ngInject */
    function EventParameterName($translate, StorageHelper, TRANSLATION_MODEL_TYPE) {
        return eventParameterName;

        ////////////////

        function eventParameterName(eventParamName, eventName, isTechnicToTranslatedText) {
            isTechnicToTranslatedText = isNaN(isTechnicToTranslatedText) ? true : isTechnicToTranslatedText;

            let obj = {
                name: eventParamName,
                description: ""
            };

            let language = $translate.storage().get('NG_TRANSLATE_LANG_KEY');

            let translations = StorageHelper.getTranslation(TRANSLATION_MODEL_TYPE.EVENT, language);
            if (translations) {
                let translation = translations.find(onFindTranslation);
                if (translation && translation.value && translation.value.params) {
                    let translatedParam = translation.value.params.find(onFindParam);
                    if (translatedParam) {
                        if (isTechnicToTranslatedText) {
                            obj.name = translatedParam.text;
                            obj.description = translatedParam.description;
                        }else{
                            obj.name = translatedParam.key;
                        }
                    }
                }
            }

            return obj;

            ////////////////////////

            function onFindTranslation(translation) {
                return translation.value.eventName.key === eventName;
            }

            function onFindParam(param) {
                return isTechnicToTranslatedText ? param.key === eventParamName : param.text === eventParamName;
            }
        }
    }

})(angular);
