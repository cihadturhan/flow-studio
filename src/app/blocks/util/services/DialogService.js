(function() {
    'use strict';

    angular
        .module('app.blocks')
        .service('DialogService', DialogService);

    DialogService.$inject = ['ngDialog', '$translate'];

    function DialogService (ngDialog, $translate) {
        var vm = this;

        vm.confirm = confirm;

        function confirm(title, titleParams, message, messageParams, okButton, cancelButton, successFunction, type){
            ngDialog.openConfirm({
                template: 'app/blocks/util/directives/ConfirmView.html',
                data: {
                    title: $translate.instant(title, titleParams),
                    message: $translate.instant(message, messageParams),
                    okButton: okButton,
                    cancelButton: cancelButton,
                    type : type || "info"
                },
                closeByDocument: false
            }).then(function(value){
                successFunction();
            },function(reject){
            });
        }
    }
})();