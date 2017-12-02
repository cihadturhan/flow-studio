/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.home')
        .controller('HomeController', HomeController);

    HomeController.$inject = [
        '$state'
    ];
    /* @ngInject */
    function HomeController($state) {
        var vm = this;

        activate();

        ////////////////

        function activate() {
            $state.go('flow.detail', {}, {reload: true});

            ////////////////////////

        }
    }

})(angular);
