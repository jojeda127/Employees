sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    function (Controller) {
        "use strict";

        return Controller.extend("logaligroup.employees.controller.Base", {
            onInit: function () {
            },
             toOrderDetails:function(oEvent) {
                var order = oEvent.getSource().getBindingContext("odataNorthwind").getObject().OrderID;
                var objectRouter = sap.ui.core.UIComponent.getRouterFor(this);
                objectRouter.navTo("RouteOrderDetails", {
                    OrderID: order
                });
            }
        });
    });