sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Filter, FilterOperator) {
        "use strict";

        return Controller.extend("logaligroup.employees.controller.MasterEmployee", {
            onInit: function () {
                this._bus = sap.ui.getCore().getEventBus();


            },

            onValidateId: function (oEvent) {
                /*                var oView = this.getView();
                
                                if (oEvent.getParameter("value").length === 6) {
                                    sap.ui.getCore().byId(this.getView().getId() + "--labelOK").setText("OK");
                                } else {
                                    sap.ui.getCore().byId(this.getView().getId() + "--labelOK").setText("NOT OK");
                                }*/
            },
            onFilter: function () {
                //var oJson = sap.ui.model.json.JSONModel();
                var oJson = this.getView().getModel("jsonEmployees").getData();
                var oJson2 = this.getView().getModel("jsonCountries").getData();
                var filters = [];

                if (oJson2.EmployeeId !== "") {
                    filters.push(new Filter("EmployeeID", FilterOperator.EQ, oJson2.EmployeeId));
                }

                if (oJson2.CountryKey !== "") {
                    filters.push(new Filter("Country", FilterOperator.EQ, oJson2.CountryKey));
                }

                var oList = this.getView().byId("_IDGenTable1");
                var oBinding = oList.getBinding("items");
                oBinding.filter(filters);
            },

            onCleanFilter: function () {
                var oModel = this.getView().getModel("jsonEmployees");
                oModel.setProperty("/EmployeeId", "");
                oModel.setProperty("/CountryKey", "");
            },

            onShowCodePostal: function (oEvent) {
                var item = oEvent.getSource();
                var itemValue = item.getBindingContext("jsonEmployees");
                var objectContext = itemValue.getObject();
                sap.m.MessageToast.show(objectContext.PostalCode);

            },
            onShowCity: function () {
                var oJson = this.getView().getModel("jsonConfig");
                oJson.setProperty("/visibleCity", true);
                oJson.setProperty("/visibleBtnShowCity", false);
                oJson.setProperty("/visibleBtnHideCity", true);

            },
            onHideCity: function () {
                var oJson = this.getView().getModel("jsonConfig");
                oJson.setProperty("/visibleCity", false);
                oJson.setProperty("/visibleBtnShowCity", true);
                oJson.setProperty("/visibleBtnHideCity", false);

            },
            onShowDetails: function (oEvent) {
                var orderTable = this.getView().byId("ordersTable");
                orderTable.destroyItems();
                var itemPress = oEvent.getSource();
                var context = itemPress.getBindingContext("odataNorthwind");

                var objectContext = context.getObject();
                var orders = objectContext.Orders;
                var ordersItems = [];

                for (var i in orders) {
                    ordersItems.push(new sap.m.ColumnListItem({
                        cells: [
                            new sap.m.Label({ text: orders[i].OrderID }),
                            new sap.m.Label({ text: orders[i].Freight }),
                            new sap.m.Label({ text: orders[i].ShipAddress })
                        ]
                    }));
                }
                var newTable = new sap.m.Table({
                    width: "auto",
                    columns: [
                        new sap.m.Column({ header: new sap.m.Label({ text: "{18n>orderId}" }) }),
                        new sap.m.Column({ header: new sap.m.Label({ text: "{18n>freight}" }) }),
                        new sap.m.Column({ header: new sap.m.Label({ text: "{18n>ShiAddress}" }) })
                    ],
                    items: ordersItems
                }).addStyleClass("sapUiSmallMargin");

                orderTable.addItem(newTable);
            },

            onShowDetailsDialog: function (oEvent) {
                var itemPress = oEvent.getSource();
                var context = itemPress.getBindingContext("odataNorthwind");
                if (!this._oDialogOrders) {
                    this._oDialogOrders = sap.ui.xmlfragment("logaligroup.employees.fragment.DialogOrders", this);
                    this.getView().addDependent(this._oDialogOrders);
                }

                this._oDialogOrders.bindElement("odataNorthwind>" + context.getPath());
                this._oDialogOrders.open();
            },

            onCloseOrder: function () {
                this._oDialogOrders.close();

            },

            showEmployees: function (oEvent) {

                var path = oEvent.getSource().getBindingContext("odataNorthwind").getPath();
                this._bus.publish("flexible", "showEmployees", path);

            }

        });
    });
