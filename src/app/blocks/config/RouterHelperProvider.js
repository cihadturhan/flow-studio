/* Help configure the state-base ui.router */
(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .provider('routerHelper', routerHelperProvider);

    routerHelperProvider.$inject = [
        '$locationProvider',
        '$stateProvider',
        '$urlRouterProvider'
    ];
    /* @ngInject */
    function routerHelperProvider($locationProvider, $stateProvider, $urlRouterProvider) {
        /* jshint validthis:true */
        var config = {
            pageTitle: undefined,
            resolveAlways: {}
        };

        //$locationProvider.html5Mode(true);

        this.configure = function (cfg) {
            angular.extend(config, cfg);
        };

        this.$get = RouterHelper;

        RouterHelper.$inject = [
            '$location',
            '$window',
            '$rootScope',
            '$state',
            '$translate',
            '$translatePartialLoader',
            '$filter',
            '$log'
        ];
        /* @ngInject */
        function RouterHelper($location, $window, $rootScope, $state, $translate,
                              $translatePartialLoader, $filter, $log) {
            var handlingStateChangeError = false;
            var hasOtherwise = false;
            var stateCounts = {
                errors: 0,
                changes: 0
            };

            var service = {
                configureStates: configureStates,
                getStates: getStates,
                stateCounts: stateCounts
            };

            init();

            return service;

            ///////////////

            function configureStates(states, otherwisePath) {
                states.forEach(
                    function (item) {
                        item.config.resolve = angular.extend({},item.config.resolve || {}, config.resolveAlways);
                        $stateProvider.state(item.state, item.config);
                    }
                );
                if (otherwisePath && !hasOtherwise) {
                    hasOtherwise = true;
                    $urlRouterProvider.otherwise(otherwisePath);
                }
            }

            function handleRoutingErrors() {
                // Route cancellation:
                // On routing error, go to the dashboard.
                // Provide an exit clause if it tries to do it twice.
                $rootScope.$on('$stateChangeError', stateChangeError);
            }

            function init() {
                handleRoutingErrors();
                updateDocTitle();
            }

            function getStates() {
                return $state.get();
            }

            function updateDocTitle() {
                $rootScope.$on('$stateChangeSuccess', stateChangeSuccess);
            }

            function stateChangeError(event, toState, toParams, fromState, fromParams, error) {
                if (handlingStateChangeError) {
                    return;
                }
                stateCounts.errors++;
                handlingStateChangeError = true;
                var destination = (toState &&
                    (toState.data.pageTitle || toState.name || toState.loadedTemplateUrl)) ||
                    'unknown target';

                $translatePartialLoader.addPart('global');
                $translate.refresh().then(
                    function () {
                        $translate('global.route.full').then(
                            function (message) {
                                var msg = $filter('format')(
                                    message,
                                    destination,
                                    (error.data || ''),
                                    (error.statusText || ''),
                                    (error.status || ''),
                                    (error || '')
                                );
                                $location.path('/');
                            }, function () {
                                $log.log(error);
                                if (!$state.current || !$state.current.name) {
                                    $state.go('home');
                                } else {
                                    $state.go($state.current.name);
                                }
                            }
                        );
                    }
                );
            }

            function stateChangeSuccess(event, toState, toParams, fromState, fromParams) {
                stateCounts.changes++;
                handlingStateChangeError = false;
                var title = toState.title;
                $translate(title || 'global.title').then(
                    function (title) {
                        $window.document.title = title;
                        $rootScope.title = title;
                    }
                );// data bind to <title>
            }
        }
    }
})(angular);
