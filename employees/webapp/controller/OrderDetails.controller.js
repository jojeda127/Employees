
sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/ui/core/routing/History',
    'sap/m/MessageBox',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator'
], function (Controller, History, MessageBox, Filter, FilterOperator) {
    function _onObjectMatched(oEvent) {

        this.onClearSignature();
        this.getView().bindElement({
            path: "/Orders(" + oEvent.getParameter("arguments").OrderID + ")",
            model: "odataNorthwind",
            events: {
                dataReceived: function (oData) {
                    _readSignature.bind(this)(oData.getParameter("data").OrderID, oData.getParameter("data").EmployeeID);
                }.bind(this)
            }
        });
        var objContext = this.getView().getModel("odataNorthwind").getContext("/Orders(" + oEvent.getParameter("arguments").OrderID + ")").getObject();
        if (objContext) {
            _readSignature.bind(this)(objContext.OrderID, objContext.EmployeeID);
        }

    };

    function _readSignature(orderId, employeeId) {
        this.getView().getModel("incidenceModel").read("/SignatureSet(OrderId='0" + orderId + "',SapId='" + this.getOwnerComponent().SapId + "',EmployeeId='00" + employeeId + "')", {
            success: function (data) {
                const signature = this.getView().byId("signature");
                if (data.MediaContent !== "") {
                    signature.setSignature("data:image/png;base64," + data.MediaContent);
                }

            }.bind(this),
            error: function (data) {

            }
        });

        //bindFile

        this.byId("uploadCollection").bindAggregation("items",{
            path:"incidenceModel>/FilesSet",
            filters:[
                new Filter("OrderId",FilterOperator.EQ ,'0'+orderId.toString()),
                new Filter("SapId",FilterOperator.EQ ,this.getOwnerComponent().SapId), 
                new Filter("EmployeeId",FilterOperator.EQ ,'00'+employeeId.toString()) 
            ],
            template: new sap.m.UploadCollectionItem({
                documentId:"{incidenceModel>AttId}",
                fileName:"{incidenceModel>FileName}",
                visibleEdit:false

            }).attachPress(this.downloadFile)
        });
    };

    return Controller.extend("logaligroup.employees.controller.OrderDetails", {


        onInit: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("RouteOrderDetails").attachPatternMatched(_onObjectMatched, this);

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
        },

        onClearSignature: function (oEvent) {
            var signature = this.byId("signature");
            signature.clear();
        },

        factoryOrderDetails: function (listId, oContext) {
            var contextObject = oContext.getObject();
            contextObject.Currency = 'EUR';

            var unitStocks = oContext.getModel().getProperty("/Products(" + contextObject.ProductID + ")/UnitsInStock");
            if (contextObject.Quantity <= unitStocks) {
                var objectList = new sap.m.ObjectListItem({
                    title: "{odataNorthwind>/Products(" + contextObject.ProductID + ")/ProductName}({odataNorthwind>Quantity})",
                    number: "{parts: [ {path:'odataNorthwind>UnitPrice'},{path:'odataNorthWind>Currency'}],type:'sap.ui.model.type.Currency',formatOptions:{showMeasure:false}}'",
                    numberUnit: "{odataNorthwind>Currency}"
                });
                return objectList;
            } else {
                var customList = new sap.m.CustomListItem({
                    content: [
                        new sap.m.Bar({
                            contentLeft: new sap.m.Label({ text: "{odataNorthwind>/Products(" + contextObject.ProductID + ")/ProductName} ({odataNorthwind>Quantity})" }),
                            contentMiddle: new sap.m.ObjectStatus({ text: "{odataNorthwind>/Products(" + contextObject.ProductID + ")/UnitsInStock} ", state: "Error" }),
                            contentRight: new sap.m.Label({ text: "{parts:[ {path: 'odataNorthwind>unitPrice'}, {path: 'odataNorthwind>Currency'}],type:'sap.ui.model.type.Currency'}" })
                            //contentRight: new sap.m.Label({ text: "{parts: [ {path: 'odataNorthwind>unitPrice'}, {path:'odataNorthwind>Currency'} ], type:'sap.ui.model.type.Currency'}" })
                        })
                    ]
                });
                return customList;

            }
        },

        onSaveSignature: function (oEvent) {
            const signature = this.byId("signature");
            var signaturePng;

            if (!signature.isFill) {
                MessageBox.error("Fill signature");
            } else {
                signaturePng = signature.getSignature().replace("data:image/png;base64,", "");
                var objectOrder = oEvent.getSource().getBindingContext("odataNorthwind").getObject();
                var body = {
                    OrderId: objectOrder.OrderID.toString(),
                    SapId: this.getOwnerComponent().SapId,
                    EmployeeId: objectOrder.EmployeeID.toString(),
                    MimeType: "image/png",
                    MediaContent: signaturePng
                };

                this.getView().getModel("incidenceModel").create("/SignatureSet", body, {
                    success: function () {
                        MessageBox.information("Sign save");
                    },
                    error: function () {
                        MessageBox.error("Sign NOT save");
                    },
                });
            }
        },

        onFileBefore: function (oEvent) {
            var fileName = oEvent.getParameter("fileName");
            var objConext = oEvent.getSource().getBindingContext("odataNorthwind").getObject();
            var customerSlug = new sap.m.UploadCollectionParameter({
                name: "slug",
                value: objConext.OrderID + ";" + this.getOwnerComponent().SapId + ";" + objConext.EmployeeID + ";" + fileName
            });

            oEvent.getParameters().addHeaderParameter(customerSlug);

        },

        onFileChange: function (oEvent) {
            var upload = oEvent.getSource();
            var headerCustomerToken = new sap.m.UploadCollectionParameter({
                name: "x-csrf-token",
                value: this.getView().getModel("incidenceModel").getSecurityToken()
            });
            upload.addHeaderParameter(headerCustomerToken);
        },

        onFileComplete:function(oEvent){
            oEvent.getSource().getBinding("items").refresh();
        },
        onFileDeleted:function(oEvent){
            var uploadCollection = oEvent.getSource();
            var sPath = oEvent.getParameter("item").getBindingContext("incidenceModel").getPath();
            this.getView().getModel("incidenceModel").remove(sPath,{
                success:function(){
                    uploadCollection.getBinding("items").refresh();
                },
                error:function(){

                }
            });
        },

        downloadFile:function(oEvent){
            const sPath= oEvent.getSource().getBindingContext("incidenceModel").getPath();
            window.open("/sap/opu/odata/sap/YSAPUI5_SRV_01" + sPath + "/$value");
        }
    });

});