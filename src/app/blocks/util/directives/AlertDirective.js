(function() {
    'use strict';

    var alert = {
        templateUrl: 'app/blocks/util/directives/AlertView.html',
        controller: AlertController
    };

    angular
        .module('app.blocks')
        .component('alert', alert);

    AlertController.$inject = ['$scope', 'AlertService'];

    function AlertController($scope, AlertService) {
        var vm = this;

        vm.alerts = AlertService.get();
        $scope.$on('$destroy', function () {
            vm.alerts = [];
        });
    }
})();
