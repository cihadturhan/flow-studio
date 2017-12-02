/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .filter('format', FormatFilter)
        .filter('capitalize', CapitalizeFilter)
        .filter('characters', CharactersFilter)
        .filter('words', WordsFilter)
        .filter('split', SplitFilter)
        .filter('yesNo', YesNoFilter)
        .filter('join', JoinFilter)
        .filter('camelize', CamelizeFilter)
        .filter('stringToObject', StringToObject)
        .filter('objectToString', ObjectToString)
        .filter('normalizeSlugUrl', NormalizeSlugUrlFilter);

    function FormatFilter() {
        return formatFilter;

        ////////////////

        function formatFilter(input) {
            // The string containing the format items (e.g. "{0}")
            // will and always has to be the first argument.
            var theString = input;

            // start with the second argument (i = 1)
            for (var i = 1; i < arguments.length; i++) {
                // "gm" = RegEx options for Global search (more than one instance)
                // and for Multiline search
                var regEx = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
                theString = theString.replace(regEx, arguments[i]);
            }

            return theString;
        }
    }

    function CapitalizeFilter() {
        return capitalizeFilter;

        ////////////////

        function capitalizeFilter(input) {
            return (input + '').replace(
                /^([a-z])|\s+([a-z])/g, function ($1) {
                    return $1.toUpperCase();
                }
            );
        }
    }

    function CharactersFilter() {
        return charactersFilter;

        ////////////////////

        function charactersFilter(input, chars, breakOnWord) {
            if (isNaN(chars)) {
                return input;
            }
            if (chars <= 0) {
                return '';
            }
            if (input && input.length > chars) {
                input = input.substring(0, chars);

                if (!breakOnWord) {
                    var lastspace = input.lastIndexOf(' ');
                    // Get last space
                    if (lastspace !== -1) {
                        input = input.substr(0, lastspace);
                    }
                } else {
                    while (input.charAt(input.length - 1) === ' ') {
                        input = input.substr(0, input.length - 1);
                    }
                }
                return input + '...';
            }
            return input;
        }
    }

    function WordsFilter() {
        return wordsFilter;

        /////////////////////

        function wordsFilter(input, words) {
            if (isNaN(words)) {
                return input;
            }
            if (words <= 0) {
                return '';
            }
            if (input) {
                var inputWords = input.split(/\s+/);
                if (inputWords.length > words) {
                    input = inputWords.slice(0, words).join(' ') + '...';
                }
            }

            return input;
        }
    }

    function SplitFilter() {
        return splitFilter;

        ////////////////

        function splitFilter(input, separator, splitIndex) {
            var split = input.split(separator);
            if (!splitIndex) {
                return split;
            }
            return split.length <= splitIndex ? '' : split[splitIndex];
        }
    }

    YesNoFilter.$inject = ['$filter'];
    function YesNoFilter($filter) {
        return yesNoFilter;

        ////////////////

        function yesNoFilter(input, trueResponse, falseResponse) {
            if (input) {
                return $filter("translate")(trueResponse || "global.form.yes")
            } else {
                return $filter("translate")(falseResponse || "global.form.no")
            }
        }
    }

    function JoinFilter() {
        return joinFilter;

        ////////////////

        function joinFilter(input, separator) {
            if (angular.isArray(input)) {
                return input.join(separator);
            }

            return '';
        }
    }

    function CamelizeFilter() {
        return camelize;

        function camelize(str) {
            return str.toLowerCase().replace(/(?:(^.)|(\s+.))/g, function(match) {
                return match.charAt(match.length-1).toUpperCase();
            });
        }
    }

    function StringToObject() {
        return stringToObject;
        function stringToObject(str) {
            return angular.fromJson(str);
        }
    }

    function ObjectToString() {
        return objectToString;
        function objectToString(obj) {
            return angular.toJson(obj);
        }
    }

    NormalizeSlugUrlFilter.$inject = ['StringUtil'];
    /* @ngInject */
    function NormalizeSlugUrlFilter(StringUtil) {
        return function (value) {
            return StringUtil.normalizeSlugUrl(value);
        }
    }
})(angular);
