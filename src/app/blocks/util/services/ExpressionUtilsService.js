/**
 * Developed by Serdar Yigit (serdar.yigit@odc.com.tr)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .service('ExpressionUtils', ExpressionUtilsService);

    ExpressionUtilsService.$inject = [
        '$filter'
    ];
    /* @ngInject */
    function ExpressionUtilsService($filter) {
        var vm = this;

        vm.generateAlphaExpr = generateAlphaExpr;
        vm.createExpression = createExpression;
        vm.createActionVariablesExpression = createActionVariablesExpression;
        vm.getDecompiledOperand = getDecompiledOperand;
        vm.parseVariable = parseVariable;

        ////////////////////////

        function generateAlphaExpr(rightOperand, item, operator) {
            var result = '';
            if (rightOperand.type === "" || !rightOperand.type) {
                var itemArr;
                if(operator == "in"){
                    itemArr = item.split(',');
                    result = " =~ " + angular.toJson(itemArr);
                }else if (operator == "not in"){
                    itemArr = item.split(',');
                    result = " !~ " + angular.toJson(itemArr);
                }
                else {
                    result = "." + operator + "('" + item + "')";
                }
                // return "." + operator + "('" + item + "')";
            } else {
                 if(operator == "in"){
                    result = " =~ " + item + " " ;
                }else if (operator === "not in"){
                    result = " !~ " + item + " " ;
                }
                else {
                    result = "." + operator + "(" + item + ")";
                }
                //return "." + operator + "(" + item + ")";
            }
            return result;
        }

        function createExpression(data, operandOptions) {
            var result = '';

            var scope = angular.lowercase(data.scope);
            if (scope == 'key') {
                result = 'l.kv().';
                let extras = $filter('stringToObject')(data.extras);
                if(extras && extras.key){
                    result += parseType(data.type, extras.key);
                }else{
                    result += parseType(data.type, data.name);
                }
            }
            else if (scope == 'eventparam') {
                if(operandOptions && operandOptions.eventName){
                    data.name = $filter('eventParameterName')(data.name, operandOptions.eventName, false).name;
                }
                result = 'l.e().';
                result += parseType(data.type, data.name);
            }
            else if (scope == 'story') {
                result = 'l.sv().';
                let extras = $filter('stringToObject')(data.extras);
                if(extras && extras.key){
                    result += parseType(data.type, extras.key);
                }else{
                    result += parseType(data.type, data.name);
                }
            }
            else if (scope == 'account') {
                result = 'l.av().';
                result += parseType(data.type, data.name);
            }
            else if (scope == 'static') {
                result = data.name;
            }
            else if(scope == 'actioncall'){
                result = 'l.ex().';
                result += parseType(data.type, data.value);
            }
            else if (scope == 'autofill') {
                result = data.value;
            }
            else if (!data.scope) {
                result = data.name;
            }
            return result;

            ///////////////////////

            function parseType(type, name) {
                var expr;
                if (type == 'Integer')
                    expr = 'getInteger(\'' + name + '\')';
                else if (type == 'Float')
                    expr = 'getFloat(\'' + name + '\')';
                else if (type == 'String')
                    expr = 'getString(\'' + name + '\')';
                return expr;
            }
        }

        function getDecompiledOperand(_expr, operandOptions) {
            var _result = {
                scope: '',
                type: '',
                name: ''
            };
            if (_expr.startsWith('l\.')) {
                var _splittedRule = _expr.split('\.');
                if (_splittedRule[1] === 'kv()') {
                    _result.scope = 'Key';
                }
                else if (_splittedRule[1] === 'e()') {
                    _result.scope = 'EventParam';
                }
                else if (_splittedRule[1] === 'sv()') {
                    _result.scope = 'Story';
                }
                else if (_splittedRule[1] === 'av()') {
                    _result.scope = 'Account';
                }
                else if (_splittedRule[1] === 'ex()') {
                    _result.scope = 'ActionCall';
                }

                var _type = _splittedRule[2].substring(0, _splittedRule[2].indexOf('('));
                if (_type === 'getInteger') {
                    _result.type = 'Integer';
                }
                else if (_type === 'getFloat') {
                    _result.type = 'Float';
                }
                else if (_type === 'getString') {
                    _result.type = 'String';
                }

                var _tempIndex = _expr.indexOf('\'');
                _result.name = _expr.substring(_tempIndex + 1, _expr.lastIndexOf('\''));

                if (_result.scope.toUpperCase() == 'EventParam'.toUpperCase() && operandOptions && operandOptions.eventName) {
                    _result.name = $filter('eventParameterName')(_result.name, operandOptions.eventName, true).name;
                } else if (_result.scope.toUpperCase() == 'Key'.toUpperCase() && operandOptions && operandOptions.variables) {
                    let variable = operandOptions.variables.find(onFindVariable);
                    let extras = $filter('stringToObject')(variable.extras);
                    _result.name = extras ? extras.displayName : _result.name;
                    _result.extras = extras;
                    if (_result.extras) {
                        _result.extras.key = variable.name;
                        _result.extras = $filter('objectToString')(_result.extras);
                    }
                }

                return _result;
            } else {
                _result.name = _expr;
                _result.value = _expr;
                _result.scope = 'static';
                return _result;
            }

            //////////////////

            function onFindVariable(variable){
                return variable.scope.toUpperCase() === _result.scope.toUpperCase() && variable.name === _result.name;
            }
        }

        function parseVariable(variable, variables) {
            var parsedVariable = {};

            var ROW_DELIMETER = "+'|~";
            var VARIABLE_DELIMETER = "+='+";
            var STATIC_VARIABLE_DELIMETER = "+=";

            var variableRows = variable.split(ROW_DELIMETER);

            angular.forEach(variableRows, onIterateSeperated);

            return parsedVariable;

            //////////////////////

            function onIterateSeperated(variableRow) {
                var key = variableRow.split(VARIABLE_DELIMETER)[0].replace("'", "");
                var value = variableRow.split(VARIABLE_DELIMETER)[1];
                if (!value) {
                    key = variableRow.split(STATIC_VARIABLE_DELIMETER)[0].replace("'", "");
                    value = variableRow.split(STATIC_VARIABLE_DELIMETER)[1].replace("'", "");
                }
                let decompiledOperand = getDecompiledOperand(value);
                let foundVariable = variables && variables.length > 0 ? variables.find(onFindVariable) : undefined;
                if (foundVariable) {
                    let variableExtras = $filter('stringToObject')(foundVariable.extras);
                    variableExtras['key'] = foundVariable.name;
                    decompiledOperand.extras = $filter('objectToString')(variableExtras);
                }

                parsedVariable[key] = decompiledOperand;

                ////////////////

                function onFindVariable(variable) {
                    let extras = angular.fromJson(variable.extras);
                    return extras && extras.displayName && decompiledOperand.name== variable.name;
                }
            }
        }


        function createActionVariablesExpression(data) {
            var result = "+'|~" + data.name + "+='+";

            var scope = angular.lowercase(data.scope);
            if (scope == 'key') {
                result += 'l.kv().';
                result += parseType(data.type, data.value);
            }

            else if (scope == 'story') {
                result += 'l.sv().';
                result += parseType(data.type, data.value);
            }
            else if (scope == 'account') {
                result += 'l.av().';
                result += parseType(data.type, data.value);
            } else if (scope.endsWith('expr')) {
                result += data.value;
            } else if (!data.scope || scope == 'static') {
                result = "+'|~" + data.name + "+=";
                result += data.value + "'";
            }
            return result;

            ///////////////////////

            function parseType(type, value) {
                var expr;
                if (type == 'Integer')
                    expr = 'getInteger(\'' + value + '\')';
                else if (type == 'Float')
                    expr = 'getFloat(\'' + value + '\')';
                else if (type == 'String')
                    expr = 'getString(\'' + value + '\')';
                return expr;
            }
        }
    }

})(angular);
