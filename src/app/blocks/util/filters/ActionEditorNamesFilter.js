/**
 * Developed by Sinan Dirlik (sinan.dirlik@odc.com.tr)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .filter('actionEditorNames', ActionEditorNames);

    ActionEditorNames.$inject = ['$translate', 'ACTION_ANCHOR_PATTERN'];
    /*@ ngInject */
    function ActionEditorNames($translate, ACTION_ANCHOR_PATTERN) {
        return actionEditorNames;

        ////////////////
        function actionEditorNames(storyDefinition, anchor, visibleActions) {
            var actionNames = "";
            var stepOrConnName = new RegExp(ACTION_ANCHOR_PATTERN).exec(anchor)[2];
            if (anchor.startsWith("action.Step")) {
                var step = storyDefinition.steps.find(onFindStep);
                if (step.actions && step.actions.length > 0) {
                    angular.forEach(step.actions, onIterateActions);
                }
            } else if (anchor.startsWith("action.Connection")) {
                var connection = storyDefinition.connections[Number(stepOrConnName)];
                if (connection.actions && connection.actions.length > 0) {
                    angular.forEach(step.actions, onIterateActions);
                }
            }
            return actionNames.substr(1);
            //////////////
            function onFindStep(step) {
                return stepOrConnName === step.name;
            }

            function onIterateActions(action) {
                if (visibleActions && visibleActions.includes(action.actionName)) {
                    actionNames += ", " + action.actionName;
                }
            }
        }
    }

})(angular);
