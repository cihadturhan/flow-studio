/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .filter('storyTemplateRepresentation', StoryTemplateRepresentation);

    StoryTemplateRepresentation.$inject = [];
    /*@ ngInject */
    function StoryTemplateRepresentation() {
        return storyTemplateRepresentation;

        ////////////////

        function storyTemplateRepresentation(storyTemplate) {}
    }

})(angular);
