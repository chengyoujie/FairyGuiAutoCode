"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const csharp_1 = require("csharp");
async function genCode(handler) {
    // let settings = (<FairyEditor.GlobalPublishSettings>handler.project.GetSettings("Publish")).codeGeneration;
    let codePkgName = handler.ToFilename(handler.pkg.name); //convert chinese to pinyin, remove special chars etc.
    let exportCodePath = handler.exportCodePath; // + '/' + codePkgName
    let fguiPath = csharp_1.System.IO.Directory.GetCurrentDirectory();
    let nodePath = csharp_1.System.IO.Path.Combine(fguiPath, "publishCode/");
    let cmdStr = nodePath + "node " + nodePath + "dist/Main.js " + " \"" + codePkgName + "\" \"" + exportCodePath + "\" \"" + fguiPath + "\"";
    console.log("============");
    console.log("开始执行 " + cmdStr);
    csharp_1.FairyEditor.ProcessUtil.Start(cmdStr, null, nodePath, true);
    console.log("执行完毕");
    console.log("============");
}
exports.genCode = genCode;
