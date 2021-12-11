import { FairyEditor, FairyGUI, System } from 'csharp';


async function genCode(handler: FairyEditor.PublishHandler) {
    // let settings = (<FairyEditor.GlobalPublishSettings>handler.project.GetSettings("Publish")).codeGeneration;
    let codePkgName = handler.ToFilename(handler.pkg.name); //convert chinese to pinyin, remove special chars etc.
    let exportCodePath = handler.exportCodePath;// + '/' + codePkgName
    let fguiPath = System.IO.Directory.GetCurrentDirectory();
    let nodePath = System.IO.Path.Combine(fguiPath, "publishCode/");
    let cmdStr = nodePath+"node "+nodePath+"dist/Main.js "+" \""+codePkgName+"\" \""+exportCodePath + "\" \""+fguiPath+"\"";
    console.log("============")
    console.log("开始执行 "+cmdStr);
    FairyEditor.ProcessUtil.Start(cmdStr, null, nodePath, true);
    console.log("执行完毕");
    console.log("============")
}

export { genCode };