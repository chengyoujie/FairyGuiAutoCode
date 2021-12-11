
import * as process from "child_process"

export type CmdCallBack = (str:string, pid:string)=>void;

export class  CMD{
    
    /**
     * 执行CMD命令行
     * @param cmd           命令行
     * @param onSuccess     成功时处理
     * @param onError       错误时处理
     * @param workspace  工作空间
     */
    public static async run(cmd:string, thisObj?:any, onSuccess?:CmdCallBack, onError?:CmdCallBack, workspace:string=undefined)
    {
        let p = process.exec(cmd, { cwd:workspace}, function(err:any, stdout:any, stderr:any){
            if(err)
            {
                if(onError)
                {
                    return onError.call(thisObj, err.message);
                }
            }else if(stderr){
                if(onError)
                {
                    return onError.call(thisObj, stderr);
                }
            }else{
                if(onSuccess)
                {
                    return onSuccess.call(thisObj, stdout);
                }
            }
        })
        p.stdout.on('data', function(data) {
            console.log(data)
        });
        p.stderr.on('data', function(data) {
            console.warn(data);
        });
    }

}