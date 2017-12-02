/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .service('RequestUtils', RequestUtilsService);

    RequestUtilsService.$inject = [];
    /* @ngInject */
    function RequestUtilsService() {
        var vm = this;

        vm.createFormEncodedRequest = createFormEncodedRequest;

        ////////////////

        function createFormEncodedRequest(data){
            var str = [];
            angular.forEach(data, onIterateData);

            //////////////////////
            function onIterateData(value, key) {
                typeof value === 'object' ? str.push(encodeURIComponent(key) + "=" + encodeURIComponent(angular.$$stringify(value))) : str.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));

            }
            return str.join("&");
        }

    }

})(angular);
