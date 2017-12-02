/* Help configure the state-base ui.router */
(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .service('StorageHelper', storageHelperService);

    storageHelperService.$inject = [
        '$localStorage',
        'STORAGE'
    ];
    /* @ngInject */
    function storageHelperService($localStorage, STORAGE) {
        let vm = this;

        vm.updateTranslation = updateTranslation;
        vm.deleteTranslation = deleteTranslation;
        vm.getTranslation = getTranslation;
        vm.updateOperators = updateOperators;
        vm.getOperators = getOperators;


        /**
         * LocalStorage will be update for given modelType
         * which specified in TRANSLATION_MODEL_TYPE constant translations
         * @param modelType
         * @param data
         */
        function updateTranslation(modelType, data) {
            if (!$localStorage[STORAGE.translation]) {
                $localStorage[STORAGE.translation] = {};
            }
            if (!$localStorage[STORAGE.translation][modelType]) {
                $localStorage[STORAGE.translation][modelType] = {};
            }
            angular.forEach(data, onIterateData);

            ////////////////////////

            function onIterateData(translatedModels, language) {
                if (!$localStorage[STORAGE.translation][modelType][language]) {
                    $localStorage[STORAGE.translation][modelType][language] = {};
                }
                translatedModels.map(onMapTranslatedModel);
                $localStorage[STORAGE.translation][modelType][language] = translatedModels;

                /////////////////////////

                function onMapTranslatedModel(model) {
                    model.value = angular.fromJson(model.value);
                    return model;
                }
            }

        }

        /**
         * If you don't give language then all translations will delete for given modelType
         * If you give language then all translation will delete for given language and modelType
         * @param modelType required
         * @param language not required
         */
        function deleteTranslation(modelType, language) {
            if (language) {
                $localStorage[STORAGE.translation][modelType][language] = {};
            } else {
                $localStorage[STORAGE.translation][modelType] = {};
            }
        }

        /**
         * @param modelType
         * @param language
         * @returns localization data for given model type and language
         */
        function getTranslation(modelType, language) {
            if ($localStorage[STORAGE.translation] && $localStorage[STORAGE.translation][modelType] && $localStorage[STORAGE.translation][modelType][language]) {
                return $localStorage[STORAGE.translation][modelType][language];
            }
        }

        /**
         * LocalStorage will be update for given operators
         * @param operatos
         */
        function updateOperators(operators) {
            $localStorage[STORAGE.operators] = operators;
        }

        /**
         *
         * @returns operators
         */
        function getOperators() {
            return $localStorage[STORAGE.operators];
        }

    }
})(angular);
