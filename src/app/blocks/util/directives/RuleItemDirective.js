/**
 * Developed by Sinan Dirlik (sinan.dirlik@odc.com.tr)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .directive('ruleItem', ruleItem);

    ruleItem.$inject = ['$document'];

    /* @ngInject */
    function ruleItem($document) {
        return {
            bindToController: true,
            controller: RuleItemController,
            controllerAs: 'vm',
            restrict: 'E',
            templateUrl: 'app/blocks/util/directives/RuleItemView.html',
            scope: {
                ruleItem: '=ngModel',
                ruleItems: '=ruleItems',
                ruleItemIndex: '=index',
                ruleGroupIndex: '=ruleGroupIndex',
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

    RuleItemController.$inject = [
        '$scope',
        '$timeout',
        'OPERATOR_TYPES'
    ];

    /* @ngInject */
    function RuleItemController($scope, $timeout, OPERATOR_TYPES) {
        var vm = this;
        vm.removeRuleItem = removeRuleItem;
        activate();

        function activate() {
            vm.operatorTypes = OPERATOR_TYPES;
            $timeout(function () {});
        }

        function removeRuleItem(itemIndex) {
            vm.ruleItems.splice(itemIndex, 1);
            vm.anchor.splice(itemIndex, 1);

            if (vm.selectedEnrichments && vm.selectedEnrichments.leftOperand && vm.model.storyDefinition.actions.indexOf(vm.selectedEnrichments.leftOperand) != -1) {
                vm.model.storyDefinition.actions.splice(vm.model.storyDefinition.actions.indexOf(vm.leftSelectedEnrichments.leftOperand), 1);
            }
            if (vm.selectedEnrichments && vm.selectedEnrichments.rightOperand && vm.model.storyDefinition.actions.indexOf(vm.selectedEnrichments.rightOperand) != -1) {
                vm.model.storyDefinition.actions.splice(vm.model.storyDefinition.actions.indexOf(vm.selectedEnrichments.rightOperand), 1);
            }
            if (vm.selectedEnrichments) {
                // TODO : remove selected left and right enrichments
                vm.selectedEnrichments.leftOperand = null;
                vm.selectedEnrichments.rightOperand = null;
            }

        }
    }
})(angular);


