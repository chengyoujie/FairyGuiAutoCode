

/**类的信息 */
export interface ClassInfo{
    /**是否导出 */
    isExport:boolean;
    /**类的名称 */
    className: string;
    // superClassName?: string;
    // resId?: string;
    /**xml资源的名字 */
    resName: string;
    /**所在的包名 */
    packName:string;
    /**变量信息 */
    members: MemberInfo[];
    // references?:string[]
    /**xml路径 */
    xmlPath:string;
    /**在包中的路径 */
    inPackPath:string;
    /**引用外部的其他包 */
    refs:string[];
    /**继承组件的名称 */
    extention?:string;
}
/**类中变量的信息 */
export interface MemberInfo {
    id?:string;

    name?: string;
    // varName?: string;
    type?: string;
    // index?: number;
    // group?: number;
    /**引用的外部包 */
    pkg?:string;
}

export interface PackInfo{
    /**当前打包的路径 */
    packPath?:string;
    /**当前打包的包名 */
    packName?:string;
    /**当前打包的id */
    packId?:string;
    /**fairyUI的项目目录 */
    packRoot?:string;
    /**导出代码的src根目录 */
    exportCodePath?:string;
    
    /**类继承的基础组件 */
    componentExtends:{[clsName:string]:string};

    classInfo:ClassInfo[];
}








