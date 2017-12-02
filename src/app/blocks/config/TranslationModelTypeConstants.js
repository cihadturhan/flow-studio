(function () {
    'use strict';
    angular
        .module('app.blocks')
        .constant('TRANSLATION_MODEL_TYPE', {
            'ACTION': "ACTION",
            'EVENT': "EVENT",
            'ENRICHMENT': "ENRICHMENT",
            'OPERATOR': 'OPERATOR'
        });
})();
