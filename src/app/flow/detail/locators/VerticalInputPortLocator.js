draw2d.layout.locator.VerticalInputPortLocator = draw2d.layout.locator.PortLocator.extend({
    NAME: "draw2d.layout.locator.VerticalInputPortLocator",
    init:function( ){
        this._super();
    },
    relocate:function(index, figure){
        this.applyConsiderRotation(figure, figure.getParent().getWidth()/2, 0);
    }
});