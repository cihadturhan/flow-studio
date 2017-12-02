
(function (angular) {
    'use strict';

    angular
        .module('app.flow')
        .service('FlowHelper', FlowHelperService);

    FlowHelperService.$inject = ['ExpressionUtils'];

    /* @ngInject */
    function FlowHelperService(ExpressionUtils) {
        var vm = this;

        vm.checkIsDataInUse = checkIsDataInUse;

        function checkIsDataInUse(storyDefinition, data, ruleNames, actionNames) {
            var isExist = false;
            var expr = ExpressionUtils.createExpression(data);
            angular.forEach(storyDefinition.rules, onIterateRules);
            angular.forEach(storyDefinition.actions, onIterateActions);
            return isExist;

            /////////////////////////
            function onIterateActions(action) {
                var actionName = action.actionName;
                var length = action.params.length;
                // to use break, not used forEach but for
                for (var i = 0; i < length; i++) {
                    var param = action.params[i];
                    if (param.value == data.name && param.scope == data.scope) {
                        actionNames.push(actionName);
                        isExist = true;
                        break;
                    }
                }
            }

            function onIterateRules(rule) {
                if (rule.expr.indexOf(expr) > -1) {
                    ruleNames.push(rule.name);
                    isExist = true;
                }
            }
        }

    }
})(angular);
