/**
 * Developed by Sinan Dirlik (sinan.dirlik@odc.com.tr)
 */

(function (angular) {
    'use strict';

    angular
        .module('account.timeout')
        .controller('TimeoutController', TimeoutController);

    TimeoutController.$inject = [];
    /* @ngInject */
    function TimeoutController() {
        var vm = this;
    }

})(angular);
