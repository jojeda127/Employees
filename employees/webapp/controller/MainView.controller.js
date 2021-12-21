sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("logaligroup.employees.controller.MainView", {
            onInit: function () {

            },

            onValidateId:function(oEvent){
                var oView = this.getView();

                if(oEvent.getParameter("value").length === 6) {
                    sap.ui.getCore().byId(this.getView().getId() + "--labelOK").setText("OK");
                }else{                    
                    sap.ui.getCore().byId(this.getView().getId() + "--labelOK").setText("NOT OK");
                }
            }
        });
    });
