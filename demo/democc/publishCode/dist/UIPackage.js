"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ByteBuffer_1 = require("./ByteBuffer");
const PackageItem_1 = require("./PackageItem");
const Utils_1 = require("./Utils");
var PackageItemType;
(function (PackageItemType) {
    PackageItemType[PackageItemType["Image"] = 0] = "Image";
    PackageItemType[PackageItemType["MovieClip"] = 1] = "MovieClip";
    PackageItemType[PackageItemType["Sound"] = 2] = "Sound";
    PackageItemType[PackageItemType["Component"] = 3] = "Component";
    PackageItemType[PackageItemType["Atlas"] = 4] = "Atlas";
    PackageItemType[PackageItemType["Font"] = 5] = "Font";
    PackageItemType[PackageItemType["Swf"] = 6] = "Swf";
    PackageItemType[PackageItemType["Misc"] = 7] = "Misc";
    PackageItemType[PackageItemType["Unknown"] = 8] = "Unknown";
    PackageItemType[PackageItemType["Spine"] = 9] = "Spine";
    PackageItemType[PackageItemType["DragonBones"] = 10] = "DragonBones";
})(PackageItemType = exports.PackageItemType || (exports.PackageItemType = {}));
;
var ObjectType;
(function (ObjectType) {
    ObjectType[ObjectType["Image"] = 0] = "Image";
    ObjectType[ObjectType["MovieClip"] = 1] = "MovieClip";
    ObjectType[ObjectType["Swf"] = 2] = "Swf";
    ObjectType[ObjectType["Graph"] = 3] = "Graph";
    ObjectType[ObjectType["Loader"] = 4] = "Loader";
    ObjectType[ObjectType["Group"] = 5] = "Group";
    ObjectType[ObjectType["Text"] = 6] = "Text";
    ObjectType[ObjectType["RichText"] = 7] = "RichText";
    ObjectType[ObjectType["InputText"] = 8] = "InputText";
    ObjectType[ObjectType["Component"] = 9] = "Component";
    ObjectType[ObjectType["List"] = 10] = "List";
    ObjectType[ObjectType["Label"] = 11] = "Label";
    ObjectType[ObjectType["Button"] = 12] = "Button";
    ObjectType[ObjectType["ComboBox"] = 13] = "ComboBox";
    ObjectType[ObjectType["ProgressBar"] = 14] = "ProgressBar";
    ObjectType[ObjectType["Slider"] = 15] = "Slider";
    ObjectType[ObjectType["ScrollBar"] = 16] = "ScrollBar";
    ObjectType[ObjectType["Tree"] = 17] = "Tree";
    ObjectType[ObjectType["Loader3D"] = 18] = "Loader3D";
})(ObjectType = exports.ObjectType || (exports.ObjectType = {}));
class UIPackage {
    constructor() {
        this._items = [];
        this._itemsById = {};
        this._itemsByName = {};
        this._sprites = {};
        this._dependencies = [];
        this._branches = [];
        this._branchIndex = -1;
    }
    loadPackage(buffer) {
        if (buffer.readUnsignedInt() != 0x46475549)
            throw "FairyGUI: old package format found in '" + this._resKey + "'";
        buffer.version = buffer.readInt();
        var compressed = buffer.readBool();
        this._id = buffer.readUTF();
        this._name = buffer.readUTF();
        //
        this._resKey = this._name;
        buffer.skip(20);
        if (compressed) {
            var buf = new Uint8Array(buffer.buffer, buffer.position, buffer.length - buffer.position);
            var inflater = new Zlib.RawInflate(buf);
            let buffer2 = new ByteBuffer_1.ByteBuffer(inflater.decompress());
            buffer2.version = buffer.version;
            buffer = buffer2;
        }
        var ver2 = buffer.version >= 2;
        var indexTablePos = buffer.position;
        var cnt;
        var i;
        var nextPos;
        var str;
        var branchIncluded;
        buffer.seek(indexTablePos, 4);
        cnt = buffer.readInt();
        var stringTable = new Array(cnt);
        stringTable.reduceRight;
        for (i = 0; i < cnt; i++)
            stringTable[i] = buffer.readUTF();
        buffer.stringTable = stringTable;
        buffer.seek(indexTablePos, 0);
        cnt = buffer.readShort();
        for (i = 0; i < cnt; i++)
            this._dependencies.push({ id: buffer.readS(), name: buffer.readS() });
        if (ver2) {
            cnt = buffer.readShort();
            if (cnt > 0) {
                this._branches = buffer.readSArray(cnt);
                if (UIPackage._branch)
                    this._branchIndex = this._branches.indexOf(UIPackage._branch);
            }
            branchIncluded = cnt > 0;
        }
        buffer.seek(indexTablePos, 1);
        var pi;
        var path = this._resKey;
        let pos = path.lastIndexOf('/');
        let shortPath = pos == -1 ? "" : path.substr(0, pos + 1);
        path = path + "_";
        cnt = buffer.readShort();
        for (i = 0; i < cnt; i++) {
            nextPos = buffer.readInt();
            nextPos += buffer.position;
            pi = new PackageItem_1.PackageItem();
            pi.owner = this;
            pi.type = buffer.readByte();
            pi.id = buffer.readS();
            pi.name = buffer.readS();
            buffer.readS(); //path
            pi.file = buffer.readS();
            buffer.readBool(); //exported
            pi.width = buffer.readInt();
            pi.height = buffer.readInt();
            switch (pi.type) {
                case PackageItemType.Image:
                    {
                        pi.objectType = ObjectType.Image;
                        var scaleOption = buffer.readByte();
                        if (scaleOption == 1) {
                            pi.scale9Grid = new Utils_1.Rectangle();
                            pi.scale9Grid.x = buffer.readInt();
                            pi.scale9Grid.y = buffer.readInt();
                            pi.scale9Grid.width = buffer.readInt();
                            pi.scale9Grid.height = buffer.readInt();
                            pi.tileGridIndice = buffer.readInt();
                        }
                        else if (scaleOption == 2)
                            pi.scaleByTile = true;
                        pi.smoothing = buffer.readBool();
                        break;
                    }
                case PackageItemType.MovieClip:
                    {
                        pi.smoothing = buffer.readBool();
                        pi.objectType = ObjectType.MovieClip;
                        pi.rawData = buffer.readBuffer();
                        break;
                    }
                case PackageItemType.Font:
                    {
                        pi.rawData = buffer.readBuffer();
                        break;
                    }
                case PackageItemType.Component:
                    {
                        var extension = buffer.readByte();
                        if (extension > 0)
                            pi.objectType = extension;
                        else
                            pi.objectType = ObjectType.Component;
                        pi.rawData = buffer.readBuffer();
                        // UIObjectFactory.resolvePackageItemExtension(pi);
                        break;
                    }
                case PackageItemType.Atlas:
                case PackageItemType.Sound:
                case PackageItemType.Misc:
                    {
                        let pos = pi.file.lastIndexOf(".");
                        pi.file = path + (pos == -1 ? pi.file : pi.file.substring(0, pos));
                        break;
                    }
                case PackageItemType.Spine:
                case PackageItemType.DragonBones:
                    {
                        let pos = pi.file.lastIndexOf(".");
                        pi.file = shortPath + (pos == -1 ? pi.file : pi.file.substring(0, pos));
                        pi.skeletonAnchor = new Utils_1.Point();
                        pi.skeletonAnchor.x = buffer.readFloat();
                        pi.skeletonAnchor.y = buffer.readFloat();
                        break;
                    }
            }
            if (ver2) {
                str = buffer.readS(); //branch
                if (str)
                    pi.name = str + "/" + pi.name;
                var branchCnt = buffer.readUnsignedByte();
                if (branchCnt > 0) {
                    if (branchIncluded)
                        pi.branches = buffer.readSArray(branchCnt);
                    else
                        this._itemsById[buffer.readS()] = pi;
                }
                var highResCnt = buffer.readUnsignedByte();
                if (highResCnt > 0)
                    pi.highResolution = buffer.readSArray(highResCnt);
            }
            this._items.push(pi);
            this._itemsById[pi.id] = pi;
            if (pi.name != null)
                this._itemsByName[pi.name] = pi;
            buffer.position = nextPos;
        }
        buffer.seek(indexTablePos, 2);
        cnt = buffer.readShort();
        for (i = 0; i < cnt; i++) {
            nextPos = buffer.readShort();
            nextPos += buffer.position;
            var itemId = buffer.readS();
            pi = this._itemsById[buffer.readS()];
            let sprite = { atlas: pi, rect: new Utils_1.Rectangle(), offset: new Utils_1.Point(), originalSize: new Utils_1.Point() };
            sprite.rect.x = buffer.readInt();
            sprite.rect.y = buffer.readInt();
            sprite.rect.width = buffer.readInt();
            sprite.rect.height = buffer.readInt();
            sprite.rotated = buffer.readBool();
            if (ver2 && buffer.readBool()) {
                sprite.offset.x = buffer.readInt();
                sprite.offset.y = buffer.readInt();
                sprite.originalSize.x = buffer.readInt();
                sprite.originalSize.y = buffer.readInt();
            }
            else {
                sprite.originalSize.x = sprite.rect.width;
                sprite.originalSize.y = sprite.rect.height;
            }
            this._sprites[itemId] = sprite;
            buffer.position = nextPos;
        }
        if (buffer.seek(indexTablePos, 3)) {
            cnt = buffer.readShort();
            for (i = 0; i < cnt; i++) {
                nextPos = buffer.readInt();
                nextPos += buffer.position;
                pi = this._itemsById[buffer.readS()];
                if (pi && pi.type == PackageItemType.Image) {
                    // pi.pixelHitTestData = new PixelHitTestData();
                    // pi.pixelHitTestData.load(buffer);
                }
                buffer.position = nextPos;
            }
        }
    }
}
exports.UIPackage = UIPackage;
UIPackage._branch = "";
UIPackage._instById = {};
UIPackage._instByName = {};
//# sourceMappingURL=UIPackage.js.map