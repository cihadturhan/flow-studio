/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .filter('eventName', EventName);

    EventName.$inject = [
        '$translate',
        'StorageHelper',
        'TRANSLATION_MODEL_TYPE'
    ];
    /*@ ngInject */
    function EventName($translate, StorageHelper, TRANSLATION_MODEL_TYPE) {
        return eventName;

        ////////////////

        function eventName(eventName) {
            let obj = {
                name: eventName,
                description: ""
            };

            let language = $translate.storage().get('NG_TRANSLATE_LANG_KEY');
            let translations = StorageHelper.getTranslation(TRANSLATION_MODEL_TYPE.EVENT, language);
            if (translations) {
                let translation = translations.find(onFindTranslation);
                if (translation) {
                    obj.name = translation.value.eventName.text;
                    obj.description = translation.value.description;
                }
            }

            return obj;

            ////////////////////////

            function onFindTranslation(translation) {
                return translation.value.eventName.key === eventName;
            }
        }
    }

})(angular);
