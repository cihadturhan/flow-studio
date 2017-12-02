/**
 * Developed by Ahmet Can Kepenek (ahmetcan.kepenek@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.flow')
        .service('DropInterceptorPolicy', DropInterceptorPolicyService);

    DropInterceptorPolicyService.$inject = ['CANVAS'];

    /* @ngInject */
    function DropInterceptorPolicyService(CANVAS) {
        var vm = this;

        vm.create = create;

        ////////////////////////

        function create(){
            var policy = draw2d.policy.canvas.DropInterceptorPolicy.extend({
                NAME: CANVAS.basic.policy.drop_interceptor_policy,
                delegateTarget: delegateTarget
            });

            ///////////////////

            function delegateTarget(connectInquirer, connectIntent) {
                if ((connectIntent.parent && connectIntent.parent.NAME && connectIntent.parent.NAME === CANVAS.icon.rule.config.name)
                        && connectIntent.getConnections() && connectIntent.getConnections().data && connectIntent.getConnections().data.length > 1) {

                }
                if ((connectInquirer.parent && connectInquirer.parent.NAME && connectInquirer.parent.NAME === CANVAS.icon.step.config.name) && (connectIntent.parent && connectIntent.parent.NAME && connectIntent.parent.NAME === CANVAS.icon.step.config.name)) {

                }
                if ((connectInquirer.parent && connectInquirer.parent.NAME && connectInquirer.parent.NAME === CANVAS.icon.step.config.name) && (connectIntent.parent && connectIntent.parent.NAME && connectIntent.parent.NAME === CANVAS.icon.step.config.name)) {

                }
                if ((connectInquirer.parent && connectInquirer.parent.NAME && connectInquirer.parent.NAME === CANVAS.icon.rule.config.name) && (connectIntent.parent && connectIntent.parent.NAME && connectIntent.parent.NAME === CANVAS.icon.step.config.name)) {
                    return connectIntent;
                }
                if ((connectInquirer.parent && connectInquirer.parent.NAME && connectInquirer.parent.NAME === CANVAS.icon.rule.config.name) && (connectIntent.parent && connectIntent.parent.NAME && connectIntent.parent.NAME === CANVAS.icon.rule.config.name)) {

                }
                if (!(connectInquirer instanceof draw2d.Port) && connectIntent instanceof draw2d.shape.composite.StrongComposite) {
                    return connectIntent;
                }
                if (!(connectIntent instanceof draw2d.Port) || !(connectInquirer instanceof draw2d.Port)) {
                    return null;
                }
                if (connectIntent.getConnections().getSize() >= connectIntent.getMaxFanOut()) {
                    return null;
                }
                if (connectInquirer instanceof draw2d.OutputPort && connectIntent instanceof draw2d.OutputPort) {
                    return null;
                }
                if (connectInquirer instanceof draw2d.InputPort && connectIntent instanceof draw2d.InputPort) {
                    return null;
                }
                if ((connectInquirer instanceof draw2d.Port) && (connectIntent instanceof draw2d.Port)) {
                    if (connectInquirer.getParent() === connectIntent.getParent()) {
                        // return null;
                    }
                }
                if ((connectInquirer instanceof draw2d.Port) && (connectIntent instanceof draw2d.shape.node.Hub)) {
                    return connectIntent.getHybridPort(0);
                }

                return connectIntent;
            }
            return new policy();
        }
    }
})(angular);