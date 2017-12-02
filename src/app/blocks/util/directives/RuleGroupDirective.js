/**
 * Developed by Sinan Dirlik (sinan.dirlik@odc.com.tr)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .directive('ruleGroup', ruleGroup);

    ruleGroup.$inject = ['$document'];

    /* @ngInject */
    function ruleGroup($document) {
        return {
            bindToController: true,
            controller: RuleGroupController,
            controllerAs: 'vm',
            restrict: 'E',
            templateUrl: 'app/blocks/util/directives/RuleGroupView.html',
            scope: {
                ruleGroup: '=ngModel',
                ruleGroups: '=ruleGroups',
                ruleGroupIndex: '=index',
                groupLength: '=groupLength',
                dropDownDataList: '=dropDownDataList',
                isEditOn: '=editOn',
                autoFill: '=autoFill',
                anchor: '=anchor',
                operation: '=operation',
                enrichmentData: '=enrichmentData',
                selectedEnrichments: "=selectedEnrichments",
                prePostOperations: '=prePostOperations',
                operators: "=operators"
            }
        };
    }


    //////////////////


    RuleGroupController.$inject = [
        '$scope',
        '$timeout',
        'LOGIC_OPERATORS'
    ];

    /* @ngInject */
    function RuleGroupController($scope, $timeout, LOGIC_OPERATORS) {
        var vm = this;
        vm.addRuleItem = addRuleItem;
        vm.removeGroup = removeGroup;
        vm.addInnerRuleGroup = addInnerRuleGroup;
        vm.checkForDefault = checkForDefault;
        vm.logicOperators = LOGIC_OPERATORS;
        vm.hasDefault = false;
        activate();

        function activate() {
            $timeout(function () {
                vm.checkForDefault();
            }, 0);

        }


        function addRuleItem() {
            vm.ruleGroup.ruleItems.push({
                "type": "item",
                "leftOperand": "",
                "operation": "",
                "rightOperand": "",
                "default": false
            });
            vm.anchor.push({leftOperand: {}});
        }

        function removeGroup() {
            vm.ruleGroups.splice(vm.ruleGroupIndex, 1);
            vm.anchor.splice(vm.ruleGroupIndex, 1);
        }

        function addInnerRuleGroup() {
            vm.ruleGroup.ruleItems.push({
                "type": "group",
                "groupOperator": "and",
                "ruleItems": []
            });
            vm.anchor.push([]);
        }

        function checkForDefault() {
            angular.forEach(vm.ruleGroup.ruleItems, onIterateRuleItems);

            ////////////
            function onIterateRuleItems(ruleItem) {
                if (vm.isEditOn && ruleItem.default) {
                    vm.hasDefault = true;
                }
            }
        }

    }
})(angular);
