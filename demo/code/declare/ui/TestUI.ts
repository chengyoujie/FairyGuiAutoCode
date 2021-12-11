//create on 2021-12-11 14:38:35 by cyj
import * as fgui from "fairygui-cc";
import { Test } from "../../game/module/test/Test";
//////////////////////// Test ////////////////////////
//Test 的定义
declare module "../../game/module/test/Test"
{
  export interface Test  {
			txt:fgui.GTextField;
			img:fgui.GGraph;
			comp:TestComponent;
			comp2:Comp2;
			bar:ProgressBarTest;
    }
}
//////////////////////// TestComponent ////////////////////////
//TestComponent 的定义
   interface TestComponent  {
			txtDes:fgui.GTextField;
    }
//////////////////////// ProgressBarTest ////////////////////////
//ProgressBarTest 的定义
   interface ProgressBarTest extends fgui.GProgressBar {
			bar:fgui.GGraph;
    }
