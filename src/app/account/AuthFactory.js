/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.account')
        .factory('Auth', AuthFactory);

    AuthFactory.$inject = [
        '$q',
        '$http',
        '$state',
        '$window',
        '$base64',
        '$cookies',
        '$rootScope',
        '$localStorage',
        '$sessionStorage',
        'API_URI'
    ];

    /* @ngInject */
    function AuthFactory($q, $http, $state, $window, $base64, $cookies, $rootScope, $localStorage, $sessionStorage, API_URI) {

        return {
            login: login,
            logout: logout,
            authorize: authorize,
            isMenuPermit: isMenuPermit,
            getCurrentUser: getCurrentUser,
            isAuthenticated: isAuthenticated,
            getCurrentUserToken: getCurrentUserToken
        };

        ////////////////


        function login(credentials) {
            var deferred = $q.defer();

            var data = {
                authorization: $base64.encode(credentials.username + ":" + credentials.password),
                rememberMe: credentials.rememberMe
            };

            return $http({
                url: API_URI + "/token",
                method: "POST",
                headers: {'Authorization': 'Basic ' + data.authorization, 'Content-Type': 'application/text'},
                transformResponse: function (result) {
                    try {
                        return angular.fromJson(result);
                    }
                    catch (e) {
                        return {token: result};
                    }
                }
            }).then(onTokenSuccess, onTokenError);


            return deferred.promise;

            //////////////////////////

            function onTokenSuccess(result) {
                var storedAuthData = {token: result.data.data, username: credentials.username};
                if (data.rememberMe) {
                    var now = new Date(),
                        exp = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
                    $cookies.put('_rmmbr', $base64.encode(JSON.stringify(storedAuthData)), {
                        expires: exp,
                        secure: true
                    });
                    $cookies.remove('INBOUND_GATEWAY');
                } else {
                    $cookies.put('_rmmbr', $base64.encode(JSON.stringify(storedAuthData)), {
                        secure: true
                    });
                    $cookies.remove('INBOUND_GATEWAY');
                }
                deferred.resolve(storedAuthData);
            }

            function onTokenError(result) {
                return $q.reject(result);
            }

        }

        function getCurrentUser() {
            return "demo";
        }

        function getCurrentUserToken() {
            return "demo";
        }

        function logout() {
            var deferred = $q.defer();
            $localStorage.$reset();
            $cookies.remove('_rmmbr');
            deferred.resolve();
            return deferred.promise;
        }

        function isAuthenticated() {
            return true;
        }

        function isMenuPermit() {
            return true;
        }

        function authorize() {
            if (!isAuthenticated()) {
                // $state.go('login');
                //$window.location.href = "/#!/account/login";
            }
        }

    }

})(angular);
