sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'logaligroup/employees/model/formatter'
], function (Controller, formatter) {

    //return Controller.extend("logaligroup.employees.controller.EmployeeDetails",{
    function onInit() {
        this._bus = sap.ui.getCore().getEventBus();
    };

    function onCreateIncidence() {

        var tableIncidence = this.getView().byId("tableIncidence");
        var newIncidence = sap.ui.xmlfragment("logaligroup.employees.fragment.NewIncidence", this);
        var incidenceModel = this.getView().getModel("incidenceModel");
        var odata = incidenceModel.getData();
        var index = odata.length;

        odata.push({ index: index + 1 });
        incidenceModel.refresh();
        newIncidence.bindElement("incidenceModel>/" + index);
        tableIncidence.addContent(newIncidence);


    };

    function onDelete(oEvent) {
        var contextObj = oEvent.getSource().getBindingContext("incidenceModel").getObject();
        this._bus.publish("incidence", "onDelete", {
            IncidenceId: contextObj.IncidenceId,
            SapId: contextObj.SapId,
            EmployeeId: contextObj.EmployeeId
        });
        /*    var tableIncidence = this.getView().byId("tableIncidence");
            var row = oEVent.getSource().getParent().getParent();
            var incidenceModel = this.getView().getModel("incidenceModel");
            var odata = incidenceModel.getData();
            var context = row.getBindingContext("incidenceModel");
            odata.splice(context.index - 1, 1);
            for (var i in odata) {
                odata[i].index = parseInt(i) + 1;
            }
            incidenceModel.refresh;
            tableIncidence.removeContent(row);
    
            for (var j in tableIncidence.getContent()) {
                tableIncidence.getContent()[j].bindElement("incidenceModel>/" + j);
            }*/
    };

    function onSaveIncidence(oEvent) {
        var row = oEvent.getSource().getParent().getParent();
        var incidenceRow = row.getBindingContext("incidenceModel");
        this._bus.publish("incidence", "onSaveIncidence", { incidenceRow: incidenceRow.sPath.replace("/", "") });
    };

    function updataIncidenceDate(oEvent) {
        var context = oEvent.getSource().getBindingContext("incidenceModel");
        var contextObj = context.getObject();
        contextObj.CreationDateX = true;
    };

    function updateIncidenceReason(oEvent) {
        var context = oEvent.getSource().getBindingContext("incidenceModel");
        var contextObj = context.getObject();
        contextObj.ReasonX = true;
    };

    function updateIncidenceType(oEvent) {
        var context = oEvent.getSource().getBindingContext("incidenceModel");
        var contextObj = context.getObject();
        contextObj.TypeX = true;
    };

    var EmployeeDetails = Controller.extend("logaligroup.employees.controller.EmployeeDetails", {});
    EmployeeDetails.prototype.onInit = onInit;
    EmployeeDetails.prototype.onCreateIncidence = onCreateIncidence;
    EmployeeDetails.prototype.Formatter = formatter;
    EmployeeDetails.prototype.onDelete = onDelete;
    EmployeeDetails.prototype.onSaveIncidence = onSaveIncidence;
    EmployeeDetails.prototype.updataIncidenceDate = updataIncidenceDate;
    EmployeeDetails.prototype.updateIncidenceReason = updateIncidenceReason;
    EmployeeDetails.prototype.updateIncidenceType = updateIncidenceType;
    return EmployeeDetails;

});

//q});