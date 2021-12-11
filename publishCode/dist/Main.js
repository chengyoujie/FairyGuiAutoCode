"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const xml_1 = require("../libs/xml");
const CompInnerVars_1 = require("./CompInnerVars");
const Utils_1 = require("./utils/Utils");
const Emit_1 = require("./Emit");
class Main {
    constructor() {
        let s = this;
        let params = process.argv;
        s.packInfo = { componentExtends: {}, classInfo: [] };
        s.emit = new Emit_1.Emit();
        s.packInfo.packName = params[2];
        s.packInfo.exportCodePath = path.resolve(process.cwd(), params[3]);
        s.packInfo.packRoot = params[4] + "/assets";
        s.packInfo.packPath = s.packInfo.packRoot + "/" + s.packInfo.packName;
        var packageXmlStr = fs.readFileSync(path.join(s.packInfo.packPath, "package.xml"), "utf-8");
        var packageXml = xml_1.parse(packageXmlStr);
        this.packInfo.packId = packageXml.attributes["id"];
        let excludeArr = [];
        for (let i = 0; i < packageXml.children.length; i++) {
            let item = packageXml.children[i];
            if (item.localName == "publish") { //发布设置 找出不需要导出的类
                let child = item;
                if (child.$excluded) {
                    excludeArr.push(...child.$excluded.split(","));
                }
            }
        }
        for (let i = 0; i < packageXml.children.length; i++) {
            let item = packageXml.children[i];
            if (item.localName == "resources" && item.children) { //解析resource  找出需要导出的类
                for (let j = 0; j < item.children.length; j++) {
                    let child = item.children[j];
                    if (child.name == "component") {
                        var clsName = child.$name.replace(".xml", "");
                        var clsInfo = {
                            isExport: child.$exported == 'true' && excludeArr.indexOf(child.$id) == -1,
                            xmlPath: path.join(s.packInfo.packPath, child.$path, child.$name),
                            className: clsName,
                            packName: this.packInfo.packName,
                            resName: child.$name,
                            members: [],
                            refs: [s.packInfo.packName],
                            extention: "",
                            inPackPath: child.$path,
                        };
                        s.packInfo.classInfo.push(clsInfo); //this.createCode(path.join(s.packName, child.$path))
                    }
                }
            }
        }
        for (let i = 0; i < s.packInfo.classInfo.length; i++) {
            let clsInfo = s.packInfo.classInfo[i];
            this.parserCls(clsInfo);
        }
        s.emit.emit(s.packInfo);
    }
    //解析类的内容
    parserCls(clsInfo) {
        var packageXmlStr = fs.readFileSync(clsInfo.xmlPath, "utf-8");
        var packageXml = xml_1.parse(packageXmlStr);
        let comExt = packageXml.attributes["extention"];
        if (comExt) {
            clsInfo.extention = this.packInfo.componentExtends[clsInfo.className] = Utils_1.getVarType(comExt);
        }
        var refrence = [];
        if (packageXml.children) {
            this.searchAllRef(clsInfo.xmlPath, refrence);
            for (let i = 0; i < packageXml.children.length; i++) {
                let item = packageXml.children[i];
                if (item.localName == "displayList") {
                    for (let j = 0; j < item.children.length; j++) {
                        let child = item.children[j];
                        if (/^n\d+$/.test(child.$name))
                            continue;
                        let type = Utils_1.getVarType(child.name);
                        if (child.name == "component" && child.$fileName) {
                            type = child.$fileName.replace(".xml", "");
                        }
                        if (child.name == "group" && !child.$advanced)
                            continue; //普通组，不会生成对应的变量
                        if (!CompInnerVars_1.filterInnerVars(clsInfo.extention || clsInfo.className, child.$name)) {
                            clsInfo.members.push({ id: child.$id, name: child.$name, type, pkg: child.$pkg });
                        }
                    }
                }
            }
        }
        if (refrence.length > 0) {
            for (let i = 0; i < refrence.length; i++) {
                let refId = refrence[i];
                let refPackInfo = this.getPackInfo(refId);
                if (refPackInfo && clsInfo.refs.indexOf(refPackInfo.name) == -1) {
                    clsInfo.refs.push(refPackInfo.name);
                }
            }
        }
    }
    /**根据包的id获取包的简单信息 */
    getPackInfo(id) {
        if (!this._id2PackName) {
            this._id2PackName = {};
            let url = path.normalize(this.packInfo.packRoot);
            var stats = fs.statSync(url);
            if (stats.isDirectory()) {
                var files = fs.readdirSync(url);
                for (var i = 0, len = files.length; i < len; i++) {
                    if (!fs.statSync(path.join(url, files[i])).isDirectory())
                        continue;
                    let packXmlPath = path.join(url, files[i], "package.xml");
                    if (!fs.existsSync(packXmlPath))
                        continue;
                    let packXmlStr = fs.readFileSync(packXmlPath, "utf-8");
                    let packXml = xml_1.parse(packXmlStr);
                    this._id2PackName[packXml.$id] = { name: files[i], path: packXmlPath, data: packXml };
                }
            }
        }
        return this._id2PackName[id];
    }
    /**查找当前组件所引用的类 */
    searchAllRef(xmlPath, refs) {
        if (!fs.existsSync(xmlPath))
            return;
        var packageXmlStr = fs.readFileSync(xmlPath, "utf-8");
        var packageXml = xml_1.parse(packageXmlStr);
        for (let i = 0; i < packageXml.children.length; i++) {
            let item = packageXml.children[i];
            if (item.localName == "displayList") {
                for (let j = 0; j < item.children.length; j++) {
                    let child = item.children[j];
                    let pkg = child.$pkg;
                    if (pkg) {
                        if (refs.indexOf(pkg) == -1)
                            refs.push(pkg);
                    }
                    if (child.$font) {
                        pkg = child.$font.substring(5, 13);
                        if (refs.indexOf(pkg) == -1)
                            refs.push(pkg);
                    }
                    if (child.name == "component") {
                        if (child.$fileName) {
                            let packInfo = this.getPackInfo(child.$pkg || this.packInfo.packId);
                            if (packInfo) {
                                let packPath = this.findXmlPathInPack(packInfo.data, child.$fileName);
                                if (packPath)
                                    this.searchAllRef(packPath, refs);
                            }
                            else {
                                console.warn("查找引用时  没有找到 " + child.$fileName + " pkg:" + child.$pkg + " 对应的xml文件");
                            }
                        }
                    }
                }
            }
        }
    }
    /**
     * 根据包的xml查找fileName的路径
     * @param packageXml
     * @param fileName
     * @returns
     */
    findXmlPathInPack(packageXml, fileName) {
        for (let i = 0; i < packageXml.children.length; i++) {
            let item = packageXml.children[i];
            if (item.localName == "resources" && item.children) { //解析resource  找出需要导出的类
                for (let j = 0; j < item.children.length; j++) {
                    let child = item.children[j];
                    if (child.name == "component") {
                        if (child.$name == fileName) {
                            return path.join(this.packInfo.packPath, child.$path, child.$name);
                        }
                    }
                }
            }
        }
        return "";
    }
    /**
     * 遍历文件或文件夹
     * @param url
     * @param onFile
     * @param onDir
     * @param thisObj
     */
    walkDir(url, onFile, onDir, thisObj) {
        url = path.normalize(url);
        var stats = fs.statSync(url);
        if (stats.isDirectory()) {
            if (onDir)
                onDir.call(thisObj, url);
            var files = fs.readdirSync(url);
            for (var i = 0, len = files.length; i < len; i++) {
                this.walkDir(path.join(url, files[i]), onFile, onDir, thisObj);
            }
            return true;
        }
        else {
            if (onFile)
                onFile.call(thisObj, url);
            return false;
        }
    }
}
exports.default = Main;
//test
// process.argv[2] = "Test";//"CreateRole";
// process.argv[3] = "D:/cocos/autocode/FairyGuiAutoCode/demo/democc/./../code";//"./../../src"
// process.argv[4] = "D:/cocos/autocode/FairyGuiAutoCode/demo/democc";
//run
new Main();
//# sourceMappingURL=Main.js.map