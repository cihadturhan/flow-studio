/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .filter('actionParameterName', ActionParameterName);

    ActionParameterName.$inject = [
        '$translate',
        'StorageHelper',
        'TRANSLATION_MODEL_TYPE'
    ];
    /*@ ngInject */
    function ActionParameterName($translate, StorageHelper, TRANSLATION_MODEL_TYPE) {
        return actionParameterName;

        ////////////////

        function actionParameterName(actionParamName, actionID) {
            let obj = {
                name: actionParamName,
                description: ""
            };

            let language = $translate.storage().get('NG_TRANSLATE_LANG_KEY');

            let translations = StorageHelper.getTranslation(TRANSLATION_MODEL_TYPE.ACTION, language);
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
                return translation.modelID === actionID;
            }

            function onFindParam(param) {
                return param.key === actionParamName;
            }
        }
    }

})(angular);
