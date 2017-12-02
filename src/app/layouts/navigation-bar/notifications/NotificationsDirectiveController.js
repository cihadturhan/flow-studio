/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.layout')
        .directive('notifications', NotificationsDirective);

    NotificationsDirective.$inject = [];
    /* @ngInject */
    function NotificationsDirective() {
        return {
            bindToController: true,
            controller: NotificationsController,
            controllerAs: 'vm',
            replace: true,
            templateUrl: 'app/layouts/navigation-bar/notifications/NotificationsDirectiveView.html',
            restrict: 'E',
            scope: {}
        };
    }

    NotificationsController.$inject = [
        '$state',
        '$scope',
        '$interval',
        '$rootScope',
        'Language',
        'Notification',
        'NOTIFICATION'
    ];
    /* @ngInject */
    function NotificationsController($state, $scope, $interval, $rootScope, Language, Notification, NOTIFICATION) {
        var vm = this;

        vm.unreadCount = 0;
        vm.notifications = [];
        vm.goToNotifications = goToNotifications;
        vm.notificationTimeInterval = NOTIFICATION.interval;

        activate();

        ///////////////////////////

        function activate() {
            $rootScope.$on('gatewayApp.changeLanguageSuccess', onChangeLanguageSuccess);

            loadNotifications();
            vm.interval = $interval(loadNotifications, vm.notificationTimeInterval);

            $scope.$on('$destroy', onDestroy);

            ///////////////

            function onDestroy() {
                if (vm.interval) {
                    $interval.cancel(vm.interval);
                }
            }

            function onChangeLanguageSuccess() {
                loadNotifications();
            }
        }

        function loadNotifications() {
            Language.getCurrent().then(onSuccessLanguage);

            ////////////////////

            function onSuccessLanguage(language) {
                Notification.getNotifications({language: language}, onSuccess, onError);

                /////////////////////

                function onSuccess(result) {
                    vm.notifications = result.data;
                    var unreadNotifications = vm.notifications.filter(onUnreadNotificationFilter);
                    vm.unreadCount = unreadNotifications.length;

                    //////////////////////

                    function onUnreadNotificationFilter(notification) {
                        return notification.read === false;
                    }
                }

                function onError() {
                }
            }
        }

        function goToNotifications() {
            var params = {};
            $state.go('notification', params, {reload: true});
        }
    }

})(angular);
