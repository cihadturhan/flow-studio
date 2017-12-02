/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.flow')
        .service('EventLabel', EventLabelService);

    EventLabelService.$inject = [
        '$filter',
        'ngDialog',
        'CANVAS',
        'TimeLocator',
        'TimeMiniIcon'
    ];

    /* @ngInject */
    function EventLabelService($filter, ngDialog, CANVAS, TimeLocator, TimeMiniIcon) {
        var vm = this;

        vm.create = create;

        ////////////////////////

        function create(){
            var event = draw2d.shape.basic.Label.extend({
                NAME: CANVAS.basic.label.event_label.config.name
            });

            vm.event = angular.extend(new event(CANVAS.basic.label.event_label.attr), {
                setData: setData,
                onDoubleClick: onDoubleClick
            });

            return vm.event;

            ////////////////

            function onDoubleClick(){
                var model = this;
                var dialog = ngDialog.open({
                    template: 'app/flow/detail/icon/event/EventLabelView.html',
                    appendClassName: 'ngdialog-theme-automationstudio modal-large',
                    controller: 'EventLabelController',
                    controllerAs: 'vm',
                    showClose: false,
                    closeByDocument: false,
                    closeByEscape: false,
                    closeByNavigation: true,
                    resolve: {
                        model: function modelFactory(){
                            return angular.copy(model);
                        }
                    }
                });

                dialog.closePromise.then(onCloseEventDialog);

                ////////////////////

                function onCloseEventDialog(data) {
                    if (!data.value || data.value === '$closeButton') {
                        return;
                    }
                    if (data.value.userData.eventName === 'wait') {
                        var timeMiniIcon = TimeMiniIcon.create();
                        model.parent.add(timeMiniIcon, TimeLocator.create());
                        model.parent.remove(model);
                        timeMiniIcon.openEditor();
                    } else {
                        model.setData(data.value.userData);
                    }
                    model.repaint(model.getPersistentAttributes());
                }
            }

            function setData(data){
                this.setUserData(data);
                this.text = $filter('eventName')(data.eventName).name;
            }
        }
    }
})(angular);