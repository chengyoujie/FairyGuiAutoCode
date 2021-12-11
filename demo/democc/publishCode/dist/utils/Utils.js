"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getVarType(str) {
    str = str.charAt(0).toLocaleUpperCase() + str.substr(1);
    // switch(str){
    //     case "Component":return "Sprite";
    //     case "Group":return "Group";
    //     case "Graph":return "Shape";
    //     case "Image":return "Image";
    //     case "List":return "List";
    //     case "Label":return "Label";
    //     case "Text":
    //     case "TextField":return "TextField";
    //     case "Button":return "Button";
    //     case "Root":return "Stage";
    //     case "ProgressBar":return "ProgressBar";
    // }
    switch (str) {
        case "Text":
            str = "TextField";
            break;
    }
    return "fgui.G" + str;
}
exports.getVarType = getVarType;
function getDateStr(format) {
    format = format ? format : "yyyy-MM-dd hh:mm:ss";
    let date = new Date();
    var dateReg = {
        "M+": date.getMonth() + 1,
        "d+": date.getDate(),
        "h+": date.getHours(),
        "m+": date.getMinutes(),
        "s+": date.getSeconds(),
        "q+": Math.floor((date.getMonth() + 3) / 3),
        "S+": date.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in dateReg) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1
                ? dateReg[k] : ("00" + dateReg[k]).substr(("" + dateReg[k]).length));
        }
    }
    return format;
}
exports.getDateStr = getDateStr;
//# sourceMappingURL=Utils.js.map