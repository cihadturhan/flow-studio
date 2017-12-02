/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('account.login')
        .controller('LoginController', LoginController);

    LoginController.$inject = [
        '$state',
        'Auth'
    ];
    /* @ngInject */
    function LoginController($state, Auth) {
        var vm = this;
        vm.model = {};

        vm.login = login;

        activate();

        ////////////////

        function activate() {

        }

        function login(event) {
            event.preventDefault();
            Auth.login(vm.model).then(onSuccess, onError);

            /////////////////

            function onSuccess(result){
                $state.go('home');
            }

            function onError(result){
                $state.go('login');
            }
        }
    }

})(angular);
