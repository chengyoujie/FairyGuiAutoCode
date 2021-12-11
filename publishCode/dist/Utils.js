"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Point {
}
exports.Point = Point;
class Rectangle {
}
exports.Rectangle = Rectangle;
//Buffer转ArrayBuffer
function toArrayBuffer(buf) {
    var ab = new ArrayBuffer(buf.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buf.length; ++i) {
        view[i] = buf[i];
    }
    return ab;
}
exports.toArrayBuffer = toArrayBuffer;
//ArrayBuffer转Buffer
function toBuffer(ab) {
    var buf = new Buffer(ab.byteLength);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buf.length; ++i) {
        buf[i] = view[i];
    }
    return buf;
}
exports.toBuffer = toBuffer;
//# sourceMappingURL=Utils.js.map