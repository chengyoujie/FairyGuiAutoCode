"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ByteArray_1 = require("./ByteArray");
class ByteBuffer extends ByteArray_1.ByteArray {
    constructor(buffer, bufferExtSize) {
        super(buffer, bufferExtSize);
        this.version = 0;
    }
    skip(count) {
        this.position += count;
    }
    readBool() {
        return this.readByte() == 1;
    }
    readS() {
        var index = this.readUnsignedShort();
        if (index == 65534) //null
            return null;
        else if (index == 65533)
            return "";
        else
            return this.stringTable[index];
    }
    readSArray(cnt) {
        var ret = new Array(cnt);
        for (var i = 0; i < cnt; i++)
            ret[i] = this.readS();
        return ret;
    }
    writeS(value) {
        var index = this.readUnsignedShort();
        if (index != 65534 && index != 65533)
            this.stringTable[index] = value;
    }
    readColor(hasAlpha) {
        var r = this.readUnsignedByte();
        var g = this.readUnsignedByte();
        var b = this.readUnsignedByte();
        var a = this.readUnsignedByte();
        return (hasAlpha ? (a << 24) : 0) + (r << 16) + (g << 8) + b;
    }
    readChar() {
        var i = this.readUnsignedShort();
        return String.fromCharCode(i);
    }
    readBuffer() {
        var count = this.readUnsignedInt();
        var ba = new ByteBuffer(new Uint8Array(this.buffer, this.position, count));
        ba.stringTable = this.stringTable;
        ba.version = this.version;
        this.position += count;
        return ba;
    }
    seek(indexTablePos, blockIndex) {
        var tmp = this.position;
        this.position = indexTablePos;
        var segCount = this.readByte();
        if (blockIndex < segCount) {
            var useShort = this.readByte() == 1;
            var newPos;
            if (useShort) {
                this.position += 2 * blockIndex;
                newPos = this.readUnsignedShort();
            }
            else {
                this.position += 4 * blockIndex;
                newPos = this.readUnsignedInt();
            }
            if (newPos > 0) {
                this.position = indexTablePos + newPos;
                return true;
            }
            else {
                this.position = tmp;
                return false;
            }
        }
        else {
            this.position = tmp;
            return false;
        }
    }
}
exports.ByteBuffer = ByteBuffer;
//# sourceMappingURL=ByteBuffer.js.map