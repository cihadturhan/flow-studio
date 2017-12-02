/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .filter('actionName', ActionName);

    ActionName.$inject = [
        '$translate',
        'StorageHelper',
        'TRANSLATION_MODEL_TYPE'
    ];
    /*@ ngInject */
    function ActionName($translate, StorageHelper, TRANSLATION_MODEL_TYPE) {
        return actionName;

        ////////////////

        function actionName(actionName, actionID) {
            let obj = {
                name: actionName,
                description: ""
            };

            let language = $translate.storage().get('NG_TRANSLATE_LANG_KEY');
            let translations = StorageHelper.getTranslation(TRANSLATION_MODEL_TYPE.ACTION, language);
            if (translations) {
                let translation = translations.find(onFindTranslation);
                if (translation) {
                    obj.name = translation.value.actionName.text;
                    obj.description = translation.value.description;
                }
            }

            return obj;

            ////////////////////////

            function onFindTranslation(translation) {
                return translation.modelID === actionID;
            }
        }
    }

})(angular);
