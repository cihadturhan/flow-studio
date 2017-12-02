/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('account.detail')
        .controller('AccountDetailController', AccountDetailController);

    AccountDetailController.$inject = [
        '$rootScope',
        'Account'
    ];
    /* @ngInject */
    function AccountDetailController($rootScope, Account) {
        var vm = this;

        vm.fields = [
            {
                'text': 'account.status',
                'name': 'Status'
            },
            {
                'text': 'account.subscription_type',
                'name': 'Subscription Type'
            },
            {
                'text': 'account.creation_date',
                'name': 'Creation Date'
            },
            {
                'text': 'account.api_key',
                'name': 'Api Key'
            },
            {
                'text': 'account.subscription_date',
                'name': 'Subscription Date'
            },
            {
                'text': 'account.name',
                'name': 'Name'
            }
        ];

        activate();

        ////////////////

        function activate() {
            $rootScope.loadingSpinner = "show";
            vm.model = Account.getAccountInfo(onSuccessAccount);

            ////////////////

            function onSuccessAccount(result){
                $rootScope.loadingSpinner = "";
                vm.model = result.data;
            }

        }
    }

})(angular);
