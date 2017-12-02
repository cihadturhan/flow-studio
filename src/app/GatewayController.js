/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.home')
        .controller('GatewayController', GatewayController);

    GatewayController.$inject = [
        '$state',
        '$cookies',
        '$rootScope',
        'Auth',
        'Util',
        'Translation',
        'StorageHelper',
        'TRANSLATION_MODEL_TYPE'
    ];
    /* @ngInject */
    function GatewayController($state, $cookies, $rootScope, Auth, Util, Translation, StorageHelper, TRANSLATION_MODEL_TYPE) {
        var vm = this;

        activate();

        ////////////////

        function activate() {
            if (Auth.isAuthenticated()) {
                angular.forEach(TRANSLATION_MODEL_TYPE, onIterateTranslationModelType);
                Util.getOperators({}, {}, onSuccessOperator);
            }

            ////////////////////////<

            function onIterateTranslationModelType(value, key) {
                Translation.getTranslations({
                    'modelType': value
                }, onSuccessTranslation);

                /////////////////

                function onSuccessTranslation(result) {
                    StorageHelper.updateTranslation(value, result.data);
                }
            }

            function onSuccessOperator(result){
                StorageHelper.updateOperators(result.data);
            }

            $rootScope.gatewayParams = angular.fromJson($cookies.get('gatewayParams'));
            $cookies.remove('gatewayParams');
            if ($rootScope.gatewayParams.page === 'story.detail') {
                $state.go('smDashboard', {storyID: $rootScope.gatewayParams.storyId}, {reload: true});
            } else if ($rootScope.gatewayParams.page === 'template.detail') {
                $state.go('storyTemplate.detail', {storyTemplateID: $rootScope.gatewayParams.storyTemplateId});
            } else if ($rootScope.gatewayParams.page === 'story.monitoring') {
                $state.go('storyMonitoring', {storyID: $rootScope.gatewayParams.storyId}, {reload: true});
            }
        }
    }

})(angular);
