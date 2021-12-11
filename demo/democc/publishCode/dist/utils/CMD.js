"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const process = require("child_process");
class CMD {
    /**
     * 执行CMD命令行
     * @param cmd           命令行
     * @param onSuccess     成功时处理
     * @param onError       错误时处理
     * @param workspace  工作空间
     */
    static run(cmd, thisObj, onSuccess, onError, workspace = undefined) {
        return __awaiter(this, void 0, void 0, function* () {
            let p = process.exec(cmd, { cwd: workspace }, function (err, stdout, stderr) {
                if (err) {
                    if (onError) {
                        return onError.call(thisObj, err.message);
                    }
                }
                else if (stderr) {
                    if (onError) {
                        return onError.call(thisObj, stderr);
                    }
                }
                else {
                    if (onSuccess) {
                        return onSuccess.call(thisObj, stdout);
                    }
                }
            });
            p.stdout.on('data', function (data) {
                console.log(data);
            });
            p.stderr.on('data', function (data) {
                console.warn(data);
            });
        });
    }
}
exports.CMD = CMD;
//# sourceMappingURL=CMD.js.map