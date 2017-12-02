/**
 * Created by sinan.dirlik on 19.04.2017.
 */
(function (angular) {
    'use strict';

    angular
        .module('app.dashboard')
        .factory('Util', UtilFactory);

    UtilFactory.$inject = [
        '$resource',
        'API_URI'
    ];
    /* @ngInject */
    function UtilFactory($resource, API_URI) {
        return $resource(
            API_URI, {}, {
                getOperators: {
                    url: API_URI + "/util/operators",
                    method: "GET",
                    headers: {'Content-Type': 'application/json'}
                }
            }
        );
    }

})(angular);

