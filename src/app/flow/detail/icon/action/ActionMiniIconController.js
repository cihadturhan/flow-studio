/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.flow')
        .controller('ActionMiniIconController', ActionMiniIconController);

    ActionMiniIconController.$inject = [
        '$scope',
        'model'
    ];
    /* @ngInject */
    function ActionMiniIconController($scope, model) {
        var vm = this;

        vm.model = model;

        vm.save = save;

        activate();

        /////////////////////////

        function activate() {

        }

        function save(){
            $scope.closeThisDialog(vm.model);
        }

    }
})(angular);