sap.ui.define([], function () {
    function dateFormat(date) {
        var timeDay = 24 * 60 * 60 * 1000;
        if (date) {
            var dateNow = new Date();
            var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "yyyy/MM/dd" });
            var dateNowFormat = new Date(dateFormat.format(dateNow));

            switch (true) {
                case date.getTime() === dateNowFormat.getTime():
                    return "Today";
                case date.getTime() === dateNowFormat.getTime() + timeDay:
                    return "Tomorrow";
                case date.getTime() === dateNowFormat.getTime() - timeDay:
                    return "Yesterday";
                default:
                    return "";
            }

        }
    }

    return {
        dateFormat: dateFormat
    };

});