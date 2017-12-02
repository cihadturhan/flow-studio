/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .service('StateHandler', StateHandlerService);

    StateHandlerService.$inject = [
        '$state',
        '$window',
        '$rootScope',
        '$translate',
        'Auth',
        'API_URI',
        'VERSION',
        'Language',
        'TranslationHandler',
        'DEBUG_INFO_ENABLED',
        'AutoFlowCanvasStory'
    ];
    /* @ngInject */
    function StateHandlerService($state, $window, $rootScope, $translate, Auth, API_URI, VERSION, Language, TranslationHandler, DEBUG_INFO_ENABLED, AutoFlowCanvasStory) {
        this.initialize = initialize;

        ////////////////

        function initialize() {
            var vm = this;
            vm.rootScope = $rootScope;
            $rootScope.DEBUG_INFO_ENABLED = DEBUG_INFO_ENABLED;
            $rootScope.VERSION = VERSION;
            $rootScope.API_URI = API_URI;
            $rootScope.back = back;

            var stateChangeStart = $rootScope.$on('$stateChangeStart', onStateChangeStart);
            var stateChangeSuccess = $rootScope.$on('$stateChangeSuccess', onStateChangeSuccess);

            $rootScope.$on('$destroy', onDestroy);

            /////////////////////////////

            function onStateChangeStart(event, toState, toStateParams, fromState) {
                AutoFlowCanvasStory.initialStory();
                $rootScope.loadingSpinner = "";
                $rootScope.toState = toState;
                $rootScope.toStateParams = toStateParams;
                $rootScope.fromState = fromState;

                // Update the language
                Language.getCurrent().then(function (language) {
                    $translate.use(language);
                });


                // Redirect to a state with an external URL (http://stackoverflow.com/a/30221248/1098564)
                if (toState.external) {
                    event.preventDefault();
                    $window.open(toState.url, '_self');
                }

            }

            function onStateChangeSuccess(event, toState, toParams, fromState, fromParams) {
                $rootScope.isMenuPermit = Auth.isMenuPermit();

                var titleKey = 'global.title';

                // Remember previous state unless we've been redirected to login or we've just
                // reset the state memory after logout. If we're redirected to login, our
                // previousState is already set in the authExpiredInterceptor. If we're going
                // to login directly, we don't want to be sent to some previous state anyway
                if (!$rootScope.redirected && $rootScope.previousStateName) {
                    $rootScope.previousStateName = fromState.name;
                    $rootScope.previousStateParams = fromParams;
                }


                // Set the page title key to the one configured in state or use default one
                if (toState.data.pageTitle) {
                    titleKey = toState.data.pageTitle;
                }
                TranslationHandler.updateTitle(titleKey);
                if(!Auth.isAuthenticated() && !(toState.name === 'login')){
                    if (!vm.rootScope.gatewayParams) {
                        $state.go('login');
                    } else {
                        Auth.logout();
                    }
                }
                if(Auth.isAuthenticated() && (toState.name === 'login')){
                    $state.go('home');
                }
                $("html, body").animate({ scrollTop: 0 }, 200);
            }

            function onDestroy() {
                if (angular.isDefined(stateChangeStart) && stateChangeStart !== null) {
                    stateChangeStart();
                }
                if (angular.isDefined(stateChangeSuccess) && stateChangeSuccess !== null) {
                    stateChangeSuccess();
                }
            }

            function back() {
                // If previous state is 'activate' or do not exist go to 'home'
                if ($rootScope.previousStateName === 'activation' || $state.get($rootScope.previousStateName) === null) {
                    $state.go('home', {}, {reload: true});
                } else {
                    $state.go($rootScope.previousStateName, $rootScope.previousStateParams);
                }
            }
        }

    }

})(angular);
