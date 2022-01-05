
sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/ui/core/routing/History'
], function (Controller, History) {
    return Controller.extend("logaligroup.employees.controller.OrderDetails", {


        onInit: function () {

        },
        onBack: function (oEvent) {
            var oHistory = History.getInstance();
            var prevHash = oHistory.getPreviousHash();
            if (prevHash !== undefined) {
                window.history.go(-1);
            } else {
                var oRouter = sap.ui.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteMain", true);
            }
        }
    });

});