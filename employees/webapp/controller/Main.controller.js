
sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/m/MessageBox'
], function (Controller,MessageBox) {
    return Controller.extend("logaligroup.employees.controller.Main", {

        onBeforeRendering: function () {
            this._detailEmployeeView = this.getView().byId("detailsEmployee");
        },
        onInit: function () {
            var oView = this.getView();
            var oJson = new sap.ui.model.json.JSONModel();
            oJson.loadData("./model/json/Employees.json", false);
            oView.setModel(oJson, "jsonEmployees");

            var oJsonCountries = new sap.ui.model.json.JSONModel();
            oJsonCountries.loadData("./model/json/Countries.json", false);
            oView.setModel(oJsonCountries, "jsonCountries");

            var oJSONModelConfig = new sap.ui.model.json.JSONModel({
                visibleID: true,
                visibleName: true,
                visibleCountry: true,
                visibleCity: true,
                visibleBtnShowCity: true,
                visibleBtnHideCity: false
            });
            oView.setModel(oJSONModelConfig, "jsonConfig");

            var oJsonCountries = new sap.ui.model.json.JSONModel();
            oJsonCountries.loadData("./model/json/Layout.json", false);
            oView.setModel(oJsonCountries, "jsonLayout");
            this._bus = sap.ui.getCore().getEventBus();
            this._bus.subscribe("flexible", "showEmployees", this.showEmployeeDetails, this);
            this._bus.subscribe("incidence", "onSaveIncidence", this.onSaveIncidence, this);
            this._bus.subscribe("incidence", "onDelete", function (channelId, eventId, data) {
                this.getView().getModel("incidenceModel").remove("/IncidentsSet(IncidenceId='" + data.IncidenceId +
                    "',SapId='" + data.SapId +
                    "',EmployeeId='" + data.EmployeeId + "')",  {
                    success: function () {
                        this.onReadDataInstances.bind(this)(data.EmployeeId.toString());
                        sap.m.MessageToast.show("Delete OK");
                    }.bind(this),
                    error: function (e) {
                        sap.m.MessageToast.show("No delete");
                    }.bind(this)
                });
            }, this);

        },


        showEmployeeDetails: function (category, nameEvent, path) {
            var detailView = this.getView().byId("detailsEmployee");
            detailView.bindElement("odataNorthwind>" + path);
            this.getView().getModel("jsonLayout").setProperty("/ActiveKey", "TwoColumnsMidExpanded");

            var incidenceModel = new sap.ui.model.json.JSONModel([]);
            detailView.setModel(incidenceModel, "incidenceModel");
            detailView.byId("tableIncidence").removeAllContent();
            this.onReadDataInstances(this._detailEmployeeView.getBindingContext("odataNorthwind").getObject().EmployeeID);
        },

        onSaveIncidence: function (channelId, eventId, data) {
            let oResourceBudle = this.getView().getModel("i18n").getResourceBundle();
            var employee = this._detailEmployeeView.getBindingContext("odataNorthwind").getObject().EmployeeID;
            var incidenceModel = this._detailEmployeeView.getModel("incidenceModel").getData();

            if (typeof incidenceModel[data.incidenceRow].IncidenceId === 'undefined') {
                var body = {
                    SapId: this.getOwnerComponent().SapId,
                    EmployeeId: employee.toString(),
                    CreationDate: incidenceModel[data.incidenceRow].CreationDate,
                    Type: incidenceModel[data.incidenceRow].Type,
                    Reason: incidenceModel[data.incidenceRow].Reason
                };
                this.getView().getModel("incidenceModel").create("/IncidentsSet", body, {
                    success: function () {
                        this.onReadDataInstances.bind(this)(employee.toString());
                        MessageBox.success(oResourceBudle.getText("odataSaveOK"));
                        //sap.m.MessageToast.show(oResourceBudle.getText("odataSaveOK"));
                    }.bind(this),
                    error: function (e) {
                        sap.m.MessageToast.show(oResourceBudle.getText("odataSaveKO"));
                    }.bind(this)
                })
            } else if (incidenceModel[data.incidenceRow].CreationDateX ||
                incidenceModel[data.incidenceRow].ReasonX ||
                incidenceModel[data.incidenceRow].TypeX) {
                var body = {
                    CreationDate: incidenceModel[data.incidenceRow].CreationDate,
                    CreationDateX: incidenceModel[data.incidenceRow].CreationDateX,
                    Type: incidenceModel[data.incidenceRow].Type,
                    TypeX: incidenceModel[data.incidenceRow].TypeX,
                    Reason: incidenceModel[data.incidenceRow].Reason,
                    ReasonX: incidenceModel[data.incidenceRow].ReasonX
                };

                this.getView().getModel("incidenceModel").update("/IncidentsSet(IncidenceId='" + incidenceModel[data.incidenceRow].IncidenceId +
                    "',SapId='" + incidenceModel[data.incidenceRow].SapId +
                    "',EmployeeId='" + incidenceModel[data.incidenceRow].EmployeeId + "')", body, {
                    success: function () {
                        this.onReadDataInstances.bind(this)(employee.toString());
                        MessageBox.success(oResourceBudle.getText("odataUpdateOK"));
                        //sap.m.MessageToast.show(oResourceBudle.getText("odataUpdateOK"));
                    }.bind(this),
                    error: function (e) {
                        sap.m.MessageToast.show(oResourceBudle.getText("No changes"));
                    }.bind(this)
                });

            } else {
                sap.m.MessageToast.show("Error");
            };
        },

        onReadDataInstances: function (employeeID) {
            this.getView().getModel("incidenceModel").read("/IncidentsSet", {
                filters: [
                    new sap.ui.model.Filter("SapId", "EQ", this.getOwnerComponent().SapId),
                    new sap.ui.model.Filter("EmployeeId", "EQ", employeeID.toString())
                ],
                success: function (data) {
                    var incidenceModel = this._detailEmployeeView.getModel("incidenceModel");
                    incidenceModel.setData(data.results);
                    var tableIncidence = this._detailEmployeeView.byId("tableIncidence");
                    tableIncidence.removeAllContent();

                    for (var i in data.results) {
                        data.results[i]._ValidateDate = true;
                        data.results[i].EnabledSave = false;
                        var newIncidence = sap.ui.xmlfragment("logaligroup.employees.fragment.NewIncidence", this._detailEmployeeView.getController());
                        this._detailEmployeeView.addDependent(newIncidence);
                        newIncidence.bindElement("incidenceModel>/" + i);
                        tableIncidence.addContent(newIncidence);
                    }
                }.bind(this),
                error: function (e) {

                }
            });
        }
    });
});