draw2d.layout.locator.VerticalOutputPortLocator = draw2d.layout.locator.PortLocator.extend({
    NAME: "draw2d.layout.locator.VerticalOutputPortLocator ",
    init: function () {
        this._super();
    },
    relocate: function (index, figure) {
        var p = figure.getParent();

        this.applyConsiderRotation(figure, p.getWidth() / 2, p.getHeight());
    },
});