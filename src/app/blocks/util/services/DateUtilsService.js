/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .service('DateUtils', DateUtilsService);

    DateUtilsService.$inject = ['$filter'];
    /* @ngInject */
    function DateUtilsService($filter) {
        this.clientDateFormat = format;
        this.clientShortFormat = clientShortFormat;
        this.serverDateFormat = serverFormat;
        this.getYesterday = getYesterday;
        this.getDateArrayForGivenRange = getDateArrayForGivenRange;

        ////////////////

        function clientShortFormat() {
            return 'yyyy-MM-dd';
        }

        function format() {
            return 'EEEE, dd LLLL yyyy, HH:mm:ss';
        }

        function serverFormat() {
            return "yyyy-MM-dd'T'HH:mm:ss.sss'Z'";
        }

        function getYesterday() {
            var date = new Date();
            date.setDate(date.getDate() - 1);
            return date;
        }

        function getDateArrayForGivenRange(startDate, endDate) {
            var dates = [],
                currentDate = startDate,
                addDays = function (days) {
                    var date = new Date(this.valueOf());
                    date.setDate(date.getDate() + days);
                    return date;
                };
            while (currentDate <= endDate) {
                dates.push(currentDate);
                currentDate = addDays.call(currentDate, 1);
            }
            return dates;
        }
    }

})(angular);