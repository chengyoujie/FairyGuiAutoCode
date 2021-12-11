/**生成fairygui 中的默认属性， 方便过滤属性 */

var fs = require("fs")
var path = require("path")
var declareTxt = fs.readFileSync(path.join(__dirname, "fairygui.d.txt"), "utf-8");
var findClsReg = /class\s*(\w+).*?\{([\W\w]*?)\}/gi;
var arr;
var out = "let obj = {};\n";
while(arr = findClsReg.exec(declareTxt)){
    let keys = arr[2];
    let keyArr = keys.split("\r\n");
    let newKeyArr = [];
    for(let i=0; i<keyArr.length; i++){
        let key = keyArr[i];
        if(!key)continue;
        key = key.replace(/(?:private|public|protected)/g, "").replace(/(?:\(.*?|:.*?|;.*?|\s*)$/g, "").replace(/\s*/g, "");
        if(!key)continue;
        newKeyArr.push(key);
    }
    if(newKeyArr.length>0)
    {
        let type = getVarType(arr[1]);
        out+=  `obj["${type}"] = [\"${newKeyArr.join("\",\"")}\"];\n`
    }
        
}
out += `
/**
 * 过滤与基础组件重复的变量
 * @param clsName 
 * @param varName 
 * @returns false 不用过滤    true 需要过滤
 */
export function filterInnerVars(clsName:string, varName:string){
    if(!obj[clsName])return false;
    return obj[clsName].indexOf(varName) != -1;
}`
console.log(out)
fs.writeFileSync(path.join(__dirname, "CompInnerVars.ts"), out)


function getVarType(typeStr){
    // switch(typeStr){
    //     case "GComponent":return "Sprite";
    //     case "GGroup":return "Group";
    //     case "GGraph":return "Shape";
    //     case "GImage":return "Image";
    //     case "GList":return "List";
    //     case "GLabel":return "Label";
    //     case "GTextField":return "TextField";
    //     case "GButton":return "Button";
    //     case "GProgressBar":return "ProgressBar";
    //     case "GRoot":return "Stage";
    // }
    switch(typeStr){
        case "Text": typeStr = "GTextField"; break;
    }
    return typeStr;
}