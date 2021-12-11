import { PackageItem } from "./PackageItem";

export class Point{
    x:number;
    y:number;
}

export class Rectangle{
    
    public x:number;
    public y:number;
    public width:number;
    public height:number;
}


export interface AtlasSprite {
    atlas: PackageItem;
    rect: Rectangle;
    offset: Point;
    originalSize: Point;
    rotated?: boolean;
}

//Buffer转ArrayBuffer
export function toArrayBuffer(buf) {
	var ab = new ArrayBuffer(buf.length);
	var view = new Uint8Array(ab);
	for (var i = 0; i < buf.length; ++i) {
		view[i] = buf[i];
	}	
	return ab;		
}

//ArrayBuffer转Buffer
export function toBuffer(ab) {
	var buf = new Buffer(ab.byteLength);
	var view = new Uint8Array(ab);
	for (var i = 0; i < buf.length; ++i) {
		buf[i] = view[i];
	}
	return buf;
}