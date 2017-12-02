/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.layout')
        .controller('NavigationBarController', NavigationBarController);

    NavigationBarController.$inject = [
        '$state',
        '$timeout',
        '$rootScope',
        'routerHelper',
        'Auth',
        'DEBUG_INFO_ENABLED',
        'MenuIcons'

    ];
    /* @ngInject */
    function NavigationBarController($state, $timeout, $rootScope, routerHelper, Auth, DEBUG_INFO_ENABLED, MenuIcons) {
        var vm = this;
            vm.account = {};

        vm.inProduction = !DEBUG_INFO_ENABLED;
        vm.isAuthenticated = Auth.isAuthenticated();
        vm.account = {};

        vm.login = login;
        vm.logout = logout;
        vm.rootScope = $rootScope;


        vm.home = home;
        vm.headerClick = headerClick;
        vm.state = state;
        vm.settings = settings;
        vm.changePassword = changePassword;

        vm.isCurrentPage = isCurrentPage;

        activate();

        ////////////////

        function activate() {
            vm.account.username = Auth.getCurrentUser();
            refreshNavRoutes();

            $rootScope.$on('unauthorized', logout);

            /////////////

            function logout(){
                vm.isAuthenticated = false;
                if (!vm.rootScope.gatewayParams) {
                    Auth.logout();
                    $state.go('login', {reload: true});
                } else {
                    $state.go('timeout', {reload: true});
                }
            }

        }

        function settings() {
            state('settings', true);
        }

        function changePassword() {
            state('password', true);
        }

        function login() {
            state('login', true);
        }

        function logout() {
            Auth.logout().then(onLogoutSuccess);

            ///////////

            function onLogoutSuccess(){
                state('home', true);
            }
        }

        function home() {
            state('home', true);
        }

        function headerClick(group) {
            if (angular.isArray(group.items) && group.items.length > 0) {
                state(group.items[0].state);
            } else if (group.state) {
                state(group.state);
            }
        }

        function state(state, reload) {
            $state.go(state, {}, {reload: reload});
        }

        function isCurrentPage(state, parent) {
            if (!state) {
                return false;
            }

            if ($state.current.name === state) {
                return true;
            }

            if ($state.includes(state)) {
                return true;
            }

            if (parent) {
                if ($state.includes(state.split('.')[0])) {
                    return true;
                }

                var parentName = getParentName($state.current);
                return parentName && state.indexOf(parentName) >= 0;
            }

            return getIndicatorState($state.current) === state;
        }

        function getIndicatorState(state) {
            if (state.data && state.data.menu && state.data.menu.indicatorState) {
                return state.data.menu.indicatorState;
            }

            return null;
        }

        function getParentName(state) {
            var data = angular.merge({}, Object.getPrototypeOf(state.data), state.data);
            var parent = state.parent;
            if (data && data.menu && data.menu.parent) {
                parent = data.menu.parent;
            }

            if (!parent && state.name) {
                var name = state.name.split(".");
                if (name.length > 1) {
                    parent = name[name.length - 2];
                } else {
                    parent = name[0];
                }
            }

            return parent;
        }


        function refreshNavRoutes() {
            var states = routerHelper.getStates();
            var menus = states.filter(filter);
            vm.menus = [];
            var groups = {};

            angular.forEach(menus, iterateOnRoutes);

            var app = groups.app;
            if (app) {
                angular.forEach(app.items, checkAuthorities);

                delete groups.app;
            }

            angular.forEach(groups, iterateOnGroups);

            groups = null;
            $timeout(onLoad, 1000);

            ///////////////////////////////

            function onLoad() {
                vm.menus.sort(groupSort);
                angular.forEach(vm.menus, iterateOnChild);

                //////////////////////////////

                function iterateOnChild(child) {
                    child.items.sort(sort);
                }
            }

            function iterateOnRoutes(item) {
                var prototype = Object.getPrototypeOf(item.data);
                var data = angular.merge({}, prototype, item.data);
                item.data = data;

                var parent = getParentName(item);

                if (angular.isUndefined(groups[parent])) {
                    groups[parent] = {
                        items: [],
                        icon: MenuIcons[parent.toUpperCase()]
                    };
                }

                if (angular.isNumber(item.data.menu.groupOrder)) {
                    groups[parent].groupOrder = item.data.menu.groupOrder;
                }

                groups[parent].items.push(
                    angular.extend(
                        {},
                        item.data.menu,
                        {
                            state: item.name
                        }
                    )
                );
            }

            function iterateOnGroups(item, key) {
                item.state = key;
                item.text = 'layout.nav_bar.' + key;
                if (item.items.length > 0) {
                    item.text += '.title';
                }

                checkAuthorities(item);
            }

            function filter(r) {
                return !r.abstract &&
                    angular.isObject(r.data) &&
                    angular.isObject(r.data.menu) &&
                    angular.isString(r.data.menu.text) &&
                    r.data.menu.visible !== false;
            }

            function sort(r1, r2) {
                if (!angular.isNumber(r1.order) || !angular.isNumber(r2.order)) {
                    return 0;
                }
                return r1.order - r2.order;
            }

            function groupSort(r1, r2) {
                if (!angular.isNumber(r1.groupOrder) || !angular.isNumber(r2.groupOrder)) {
                    return 0;
                }
                return r1.groupOrder - r2.groupOrder;
            }
        }

        function checkAuthorities(item) {
            var menus = [];
            angular.forEach(item.items, iterateOnItems);
            item.items = menus;
            vm.menus.push(item);


            ////////////////////

            function iterateOnItems(menu) {
                    menus.push(menu);
            }
        }

    }

})(angular);
