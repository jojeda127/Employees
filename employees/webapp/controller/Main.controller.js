sap.ui.define([
    'sap/ui/core/mvc/Controller'
 ], function(Controller) {     
     return Controller.extend("logaligroup.employees.controller.Main",{
     

         onInit:function(){
            var oView = this.getView();
            var oJson = new sap.ui.model.json.JSONModel();
            oJson.loadData("./localService/mockdata/Employees.json", false);
            oView.setModel(oJson, "jsonEmployees");

            var oJsonCountries = new sap.ui.model.json.JSONModel();
            oJsonCountries.loadData("./localService/mockdata/Countries.json", false);
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
            oJsonCountries.loadData("./localService/mockdata/Layout.json", false);
            oView.setModel(oJsonCountries, "jsonLayout");
this._bus = sap.ui.getCore().getEventBus();
this._bus.subscribe("flexible","showEmployees",this.showEmployeeDetails,this);

         },

         
            showEmployeeDetails:function(category,nameEvent,path){
                var detailView = this.getView().byId("detailsEmployee");
                detailView.bindElement("jsonEmployees>" + path); 
                this.getView().getModel("jsonLayout").setProperty("/ActiveKey","TwoColumnsMidExpanded");

            }
        });    
 });