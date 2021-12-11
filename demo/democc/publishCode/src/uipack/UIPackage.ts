import { ByteBuffer } from "./ByteBuffer";
import { PackageItem } from "./PackageItem";
import { AtlasSprite, Point, Rectangle } from "./Utils";

export enum PackageItemType {
    Image,
    MovieClip,
    Sound,
    Component,
    Atlas,
    Font,
    Swf,
    Misc,
    Unknown,
    Spine,
    DragonBones
};

export enum ObjectType {
    Image,
    MovieClip,
    Swf,
    Graph,
    Loader,
    Group,
    Text,
    RichText,
    InputText,
    Component,
    List,
    Label,
    Button,
    ComboBox,
    ProgressBar,
    Slider,
    ScrollBar,
    Tree,
    Loader3D
}
type PackageDependency = { id: string, name: string };

        //测试解析fgui 二进制文件
        // s.packName = "D:/byh/nslm/resource/assets/UI/Loading.fui";//process.argv.splice(2)[0];
        // var ui = new UIPackage();
        // var packBuff = fs.readFileSync(s.packName)
        // var arrBuff = toArrayBuffer(packBuff);
        // var byteBuff = new ByteBuffer(arrBuff)
        // ui.loadPackage(byteBuff);
        // console.log(ui)
/**
 * 解析Fgui 二进制文件
 */
export class UIPackage{
    private _id: string;
    private _name: string;
    private _resKey: string;
    private static _branch: string = "";
    private _dependencies: Array<PackageDependency>;
    private _branches: Array<string>;
    public _branchIndex: number;
    private _itemsById: { [index: string]: PackageItem };
    private _itemsByName: { [index: string]: PackageItem };
    private _sprites: { [index: string]: AtlasSprite };
    private _items: Array<PackageItem>;
    private static _instById: { [index: string]: UIPackage } = {};
    private static _instByName: { [index: string]: UIPackage } = {};

    public constructor() {
        this._items = [];
        this._itemsById = {};
        this._itemsByName = {};
        this._sprites = {};
        this._dependencies = [];
        this._branches = [];
        this._branchIndex = -1;
    }

    loadPackage(buffer: ByteBuffer): void {
        if (buffer.readUnsignedInt() != 0x46475549)
            throw "FairyGUI: old package format found in '" + this._resKey + "'";

        buffer.version = buffer.readInt();
        var compressed: boolean = buffer.readBool();
        this._id = buffer.readUTF();
        this._name = buffer.readUTF();
        //
        this._resKey = this._name;
        buffer.skip(20);

        if (compressed) {
            var buf: Uint8Array = new Uint8Array(buffer.buffer, buffer.position, buffer.length - buffer.position);
            var inflater: Zlib.RawInflate = new Zlib.RawInflate(buf);
            let buffer2: ByteBuffer = new ByteBuffer(inflater.decompress());
            buffer2.version = buffer.version;
            buffer = buffer2;
        }

        var ver2: boolean = buffer.version >= 2;
        var indexTablePos: number = buffer.position;
        var cnt: number;
        var i: number;
        var nextPos: number;
        var str: string;
        var branchIncluded: boolean;

        buffer.seek(indexTablePos, 4);

        cnt = buffer.readInt();
        var stringTable: Array<string> = new Array<string>(cnt);
        stringTable.reduceRight
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

        var pi: PackageItem;
        var path: string = this._resKey;
        let pos = path.lastIndexOf('/');
        let shortPath = pos == -1 ? "" : path.substr(0, pos + 1);
        path = path + "_";

        cnt = buffer.readShort();
        for (i = 0; i < cnt; i++) {
            nextPos = buffer.readInt();
            nextPos += buffer.position;

            pi = new PackageItem();
            pi.owner = this;
            pi.type = buffer.readByte();
            pi.id = buffer.readS();
            pi.name = buffer.readS();
            buffer.readS(); //path
            pi.file = buffer.readS();
            buffer.readBool();//exported
            pi.width = buffer.readInt();
            pi.height = buffer.readInt();

            switch (pi.type) {
                case PackageItemType.Image:
                    {
                        pi.objectType = ObjectType.Image;
                        var scaleOption: number = buffer.readByte();
                        if (scaleOption == 1) {
                            pi.scale9Grid = new Rectangle();
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
                        var extension: number = buffer.readByte();
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
                        pi.skeletonAnchor = new Point();
                        pi.skeletonAnchor.x = buffer.readFloat();
                        pi.skeletonAnchor.y = buffer.readFloat();
                        break;
                    }
            }

            if (ver2) {
                str = buffer.readS();//branch
                if (str)
                    pi.name = str + "/" + pi.name;

                var branchCnt: number = buffer.readUnsignedByte();
                if (branchCnt > 0) {
                    if (branchIncluded)
                        pi.branches = buffer.readSArray(branchCnt);
                    else
                        this._itemsById[buffer.readS()] = pi;
                }

                var highResCnt: number = buffer.readUnsignedByte();
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

            var itemId: string = buffer.readS();
            pi = this._itemsById[buffer.readS()];

            let sprite: AtlasSprite = { atlas: pi, rect: new Rectangle(), offset: new Point(), originalSize: new Point() };
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
