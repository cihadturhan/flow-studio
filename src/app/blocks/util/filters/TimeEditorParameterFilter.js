/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .filter('timeEditorParameter', TimeEditorParameter);

    TimeEditorParameter.$inject = ['$translate', 'PARAMETER_PATTERN'];
    /*@ ngInject */
    function TimeEditorParameter($translate, PARAMETER_PATTERN) {
        return timeEditorParameter;

        ////////////////

        function timeEditorParameter(actions, anchor) {
            var result = " ";
            var parsedParameterAnchor = new RegExp(PARAMETER_PATTERN.replace(/'/g,"")).exec(anchor);

            angular.forEach(actions, onIterateAction);

            return result;

            ///////////////////////

            function onIterateAction(action){
                if(action.actionName === parsedParameterAnchor[1]){
                    var scheduleType = action.params.find(onFindScheduleType);
                    var scheduleValue = action.params.find(onFindScheduleValue);

                    if (scheduleType) {
                        if (scheduleType.value === 'Delay' && !isNaN(Number(scheduleValue.value))) {
                            var scheduleUnit = action.params.find(onFindScheduleUnit);
                            result += scheduleValue.value + " " + $translate.instant('global.time.waiting.' + scheduleUnit.value) + " " + $translate.instant('global.time.waiting.later');
                        } else if (scheduleType.value === 'TimeOfDay') {
                            result += moment(scheduleValue.value, "YYYYMMDD HH:mm").format("DD/MM/YYYY HH:mm") + " " + $translate.instant('global.time.time_of_day.at');
                        }
                    }
                }

                ////////////////////

                function onFindScheduleType(item){
                    return item.name === 'scheduleType';
                }

                function onFindScheduleValue(item){
                    return item.name === 'scheduleValue';
                }

                function onFindScheduleUnit(item){
                    return item.name === 'scheduleUnit';
                }
            }
        }
    }

})(angular);
