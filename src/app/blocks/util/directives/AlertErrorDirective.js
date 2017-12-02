(function () {
    'use strict';

    var alert = {
        templateUrl: 'app/blocks/util/directives/AlertErrorView.html',
        controller: AlertErrorController
    };

    angular
        .module('app.blocks')
        .component('alertError', alert);

    AlertErrorController.$inject = ['$state', '$scope', '$rootScope', '$timeout', 'Auth', 'AlertService', 'MODAL'];

    function AlertErrorController($state, $scope, $rootScope, $timeout, Auth, AlertService, MODAL) {
        var vm = this;

        vm.alerts = [];

        function addErrorAlert(message, key, data) {
            var openingTimeout = 0;

            if (vm.alerts.length > 0) {
                openingTimeout = 500;
                vm.alerts = [];
            }

            $timeout(function () {
                key = key ? key : message;
                vm.alerts.push(
                    AlertService.add(
                        {
                            type: 'danger',
                            msg: key,
                            params: data,
                            timeout: MODAL.alertTimeout,
                            toast: AlertService.isToast(),
                            scoped: true
                        },
                        vm.alerts
                    )
                );
            }, openingTimeout);
        }

        var cleanHttpErrorListener = $rootScope.$on('gatewayApp.httpError', function (event, httpResponse) {
            var i;
            event.stopPropagation();
            switch (httpResponse.status) {
                case 0:
                    addErrorAlert('Server not reachable', 'error.server.not.reachable');
                    break;
                case 400:
                    if(httpResponse.headers('autoflow-message-code')) {
                        addErrorAlert(httpResponse.headers('autoflow-message-code'))
                    }
                    break;
                case 401:
                    addErrorAlert(httpResponse.data.message);
                    if(!event.currentScope.gatewayParams) {
                        Auth.logout();
                        $state.go('login', {}, {reload: true});
                    } else {
                        $state.go('timeout', {}, {reload: true});
                    }
                    break;
                case 404:
                    //addErrorAlert('Not found', 'global.error.not_found');
                    break;
                default:
                    if (httpResponse.data && httpResponse.data.message) {
                        addErrorAlert(httpResponse.data.message);
                    } else {
                        if (typeof httpResponse !== 'object') {
                            addErrorAlert(httpResponse);
                        }
                    }
            }
        });

        $scope.$on('$destroy', function () {
            if (angular.isDefined(cleanHttpErrorListener) && cleanHttpErrorListener !== null) {
                cleanHttpErrorListener();
                vm.alerts = [];
            }
        });
    }
})();
