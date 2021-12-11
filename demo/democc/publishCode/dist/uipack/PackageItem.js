"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PackageItem {
    constructor() {
        this.width = 0;
        this.height = 0;
    }
    // public load(): Object {
    //     return this.owner.getItemAsset(this);
    // }
    // public getBranch(): PackageItem {
    //     if (this.branches && this.owner._branchIndex != -1) {
    //         var itemId: string = this.branches[this.owner._branchIndex];
    //         if (itemId)
    //             return this.owner.getItemById(itemId);
    //     }
    //     return this;
    // }
    getHighResolution() {
        return this;
    }
    toString() {
        return this.name;
    }
}
exports.PackageItem = PackageItem;
//# sourceMappingURL=PackageItem.js.map