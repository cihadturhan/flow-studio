/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.flow')
        .service('ActionMiniIcon', ActionMiniIconService);

    ActionMiniIconService.$inject = [
        '$injector',
        'ngDialog',
        'CANVAS',
        'AutoFlowCanvasStory'
    ];

    /* @ngInject */
    function ActionMiniIconService($injector, ngDialog, CANVAS, AutoFlowCanvasStory) {
        var vm = this;

        vm.create = create;

        ////////////////////////

        function create(){
            var action = draw2d.shape.icon.Icon.extend({
                NAME: CANVAS.icon.action.config.name
            });
            vm.action = new action(CANVAS.icon.action.attr);
            vm.action.onDoubleClick = onDoubleClick;
            vm.action.createSet = createSet;

            return vm.action;

            ////////////////

            function onDoubleClick(){
                var anchor = "action.Step[" +this.getParent().getUserData().name +"]";

                var dialog = ngDialog.open({
                    template: 'app/story-template/action/ActionView.html',
                    appendClassName: 'ngdialog-theme-automationstudio modal-large',
                    controller: 'ActionController',
                    controllerAs: 'vm',
                    resolve: {
                        model: function modelFactory() {
                            return AutoFlowCanvasStory.story.storyTemplate;
                        },
                        anchor: function anchorFactory() {
                            return anchor;
                        },
                        isEditOn: function isEditOnFactory() {
                            return true;
                        },
                        actionIndex: function indexFactory() {
                            return 0;
                        }
                    }
                });

                dialog.closePromise.then(onCloseEventDialog);

                ////////////////////

                function onCloseEventDialog(data) {
                }
            }

            function createSet() {
                var x = ((this.width - 40) / 2);
                return $injector.get('AutoFlowCanvasDraw').canvas.paper.image(CANVAS.icon.action.config.image, x, 16, 40, 40);
            }

        }
    }
})(angular);
