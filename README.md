## 使用说明

需要用户安装node环境 （安装时最好勾选`npm`选项）

1.将`plugins`和`publishCode`拷贝到`.fairy`文件同级目录下

2.打开`FairyGUI`刷新插件，看到`FairyAutoCode`即安装成功

3.打开发布设置，在`全局设置`中分别配置`打包`和`发布代码`的`发布路径`，在`包设置中`勾选`为本包生成代码`，点击发布即可

## demo 说明

`democc` 为`cocos create`项目的`fairygui`UI

`code`为`democc`导出的代码

### 自定义代码格式说明

需要用户安装 `typescript` 可以使用`npm install typescript -g`安装

如果需要自定义导出代码的格式，可以打开`publishCode`项目（推荐使用`VSCode`打开项目)

1.打开`publishCode/src/Emit.ts`代码导出类，修改`emit`函数（默认的生成ts代码，如有生成其他代码的可以提交说明下）

2.`emit`函数的参数`packInfo`说明

`PackInfo`属性说明

|  属性名称   | 属性类型  | 属性描述 | 示例 |
|  ----  | ----  | ----  | ----  |
| `packPath`  | `string` | 当前打包的路径 | `D:/cocos/autocode/FairyGuiAutoCode/demo/democc/assets/Test` |
| `packName` | `string` | 当前打包的包名 | `Test` |
| `packId`  | `string` | 当前打包的id | `88z88itg` |
| `packRoot`  | `string` | fairyUI的项目目录 | `D:/cocos/autocode/FairyGuiAutoCode/demo/democc/assets` |
| `exportCodePath`  | `string` | 导出代码的src根目录 | `D:\\cocos\\autocode\\FairyGuiAutoCode\\demo\\code` |
| `componentExtends`  | `{[clsName:string]:string}` | 类继承的基础组件 | `{ProgressBarTest:'fgui.GProgressBar', ...}` |
| `classInfo`  | [`ClassInfo[]`](#classinfo) | 单元格 | `[ClassInfo, ClassInfo, ...]` |


<span id="classinfo">`ClassInfo`属性说明</span>

|  属性名称   | 属性类型  | 属性描述 | 示例 |
|  ----  | ----  | ----  | ----  |
| `isExport`  | `boolean` | 是否是导出界面 | `true` |
| `className`  | `string` | 类的名称 | `Test` |
| `resName`  | `string` | xml资源的名字 | `Test.xml` |
| `packName`  | `string` | 所在的包名 | `Test` |
| `members`  | [`MemberInfo[]`](#memberinfo) | 界面内变量信息 | `[MemberInfo, ...]` |
| `xmlPath`  | `string` | xml路径 | `D:\\cocos\\autocode\\FairyGuiAutoCode\\demo\\democc\\assets\\Test\\Test.xml` |
| `inPackPath`  | `string` | 在包中的路径 | `/` |
| `refs`  | `string[]` | 引用外部的其他包 | `[ "Test","Test2"]` |
| `extention`  | `string` | 继承组件的名称 | `fgui.GProgressBar` |


<span id="memberinfo">`MemberInfo`属性说明</span>

|  属性名称   | 属性类型  | 属性描述 | 示例 |
|  ----  | ----  | ----  | ----  |
| `id`  | `string` | 控件的id | `n3_fu72` |
| `name`  | `string` | 控件的名字 | `comp2` |
| `type`  | `string` | 控件的类型 | `Comp2` |
| `pkg`  | `string` | 引用的外部包 | `di911hki` |







