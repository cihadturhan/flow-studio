/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.layout')
        .constant(
            'MenuIcons', {
                ROOT: 'apps',
                ADMIN: 'perm_data_setting',
                ACCOUNT: 'vpn_key',
                PRODUCT: 'shopping_basket',
                MODEL: 'extension',
                RULE: 'account_balance',
                ALERT: 'add_alert',
                TASKS: 'list',
                DATABASE: "fa fa-database",
                'IMPORT-EXPORT': 'import_export',
                TRACKING: 'track_changes',
                ONBOARDING: 'create',
                DASHBOARD: 'dashboard'
            }
        );

})(angular);
