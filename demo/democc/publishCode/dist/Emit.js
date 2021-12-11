"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Utils_1 = require("./utils/Utils");
const path = require("path");
const fs = require("fs");
const os = require("os");
/**
 * 根据packInfo 导出类
 */
class Emit {
    /**导出代码者的名字 默认使用计算机名 */
    getAuthName() {
        return os.hostname() || "cyj";
    }
    /**
     * 类的保存路径
     * 如 game/module/loading/LoadingView
     * @param clsInfo
     * @returns
     */
    getModuleClassPath(clsInfo) {
        return path.normalize("game/module/" + clsInfo.packName.toLocaleLowerCase() + "/" + clsInfo.inPackPath + "/" + clsInfo.className).replace(/\\/gi, "\/");
    }
    /**输出内容 */
    emit(packInfo) {
        let s = this;
        s.packInfo = packInfo;
        this.createClass(s.packInfo);
        this.createDeclare(s.packInfo);
        console.log("生成完毕");
    }
    /**生成包内所有导出的逻辑类 */
    createClass(packInfo) {
        for (let i = 0; i < packInfo.classInfo.length; i++) {
            let clsInfo = packInfo.classInfo[i];
            if (clsInfo.isExport) {
                this.createOneClass(clsInfo);
            }
        }
    }
    /**包内所有的声明导出到同一个ts文件中 */
    createDeclare(packInfo) {
        if (packInfo.classInfo.length > 0) {
            let declareStr = "";
            let decalreTopStr = `//create on ${Utils_1.getDateStr()} by ${this.getAuthName()}\nimport * as fgui from "fairygui-cc";`;
            for (let i = 0; i < packInfo.classInfo.length; i++) {
                let clsInfo = packInfo.classInfo[i];
                if (clsInfo.isExport) {
                    decalreTopStr += `\nimport { ${clsInfo.className} } from "../../${this.getModuleClassPath(clsInfo)}";`;
                }
                declareStr += this.createOneDeclare(clsInfo);
            }
            declareStr = `${decalreTopStr}\n${declareStr}`;
            let outPath = path.join(packInfo.exportCodePath, "declare/ui", packInfo.packName.charAt(0).toLocaleUpperCase() + packInfo.packName.substr(1) + "UI.ts");
            this.saveFile(outPath, declareStr, true);
        }
        else {
            console.log("没有要导出的声明 " + this.packInfo.packName);
        }
    }
    /**生成一个声明文件**/
    createOneDeclare(clsInfo) {
        let memberDeclare = ""; //成员变量的声明
        for (let i = 0; i < clsInfo.members.length; i++) {
            let memInfo = clsInfo.members[i];
            memberDeclare += `\t\t\t${memInfo.name}:${memInfo.type};`;
            if (i < clsInfo.members.length - 1)
                memberDeclare += "\n";
        }
        let declarStr = `//////////////////////// ${clsInfo.className} ////////////////////////\n`;
        declarStr += `//${clsInfo.className} 的定义\n`;
        if (clsInfo.isExport) { //导出类的定义
            declarStr += `declare module "../../${this.getModuleClassPath(clsInfo)}"\n{\n`;
        }
        declarStr += ``;
        declarStr += `  ${clsInfo.isExport ? "export" : ""} interface ${clsInfo.className} ${this.packInfo.componentExtends[clsInfo.className] ? "extends " + this.packInfo.componentExtends[clsInfo.className] : ""} {\n`;
        declarStr += `${memberDeclare}\n`;
        declarStr += `    }\n`;
        if (clsInfo.isExport) { //导出类的定义
            declarStr += `}\n`;
        }
        return declarStr;
    }
    /**生成其中的一个逻辑类**/
    createOneClass(clsInfo) {
        let auth = this.getAuthName();
        let clsStr = //class 类的格式
         `import * as fgui from "fairygui-cc";

/**
 * 
 * made by ${auth}
 * create on ${Utils_1.getDateStr()}
 * ${clsInfo.className}
 */
export class ${clsInfo.className} extends ${clsInfo.extention || "fgui.GComponent"} {

    public constructor()  {
        super();
        let s = this;
    }
}
`;
        let outPath = path.join(this.packInfo.exportCodePath, this.getModuleClassPath(clsInfo) + ".ts");
        this.saveFile(outPath, clsStr, false);
    }
    // -----------------------------------------保存文件的函数    
    /**
     * 保存文件
     * @param filePath  要写入文件的路径
     * @param content 要写入文件的内容
     * @param isOverWrite 如果文件已存在是否覆盖
     */
    saveFile(filePath, content, isOverWrite) {
        if (!isOverWrite && fs.existsSync(filePath))
            return; //文件已存在不进行处理
        this.mkdir(filePath);
        fs.writeFileSync(filePath, content);
        console.log("写入文件： " + filePath);
    }
    /**根据文件名，创建对应的文件夹 */
    mkdir(filePath) {
        if (filePath.indexOf(".") != -1) {
            filePath = path.join(filePath, "./..");
        }
        filePath = path.normalize(filePath);
        let dirs = filePath.split(path.sep);
        let tempDir = "";
        for (let i = 0; i < dirs.length; i++) {
            tempDir += dirs[i] + path.sep;
            if (!fs.existsSync(tempDir))
                fs.mkdirSync(tempDir);
        }
    }
}
exports.Emit = Emit;
//# sourceMappingURL=Emit.js.map