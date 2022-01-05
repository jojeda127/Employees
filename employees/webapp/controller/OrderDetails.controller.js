
sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/ui/core/routing/History'
], function (Controller, History) {
    function _onObjectMatched() {
        this.getView().bindElement({
            path: "/Orders(" + oEvent.getParameter("arguments").OrderID + ")",
            model: "odataNorthwind"
        });
    }
    return Controller.extend("logaligroup.employees.controller.OrderDetails", {


        onInit: function () {
            var oRouter = sap.ui.core.UICompenent.getRouterFor(this);
            oRouter.getRouter("RouteOrderDetails").attachPatternMatched(_onObjectMatched, this);

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