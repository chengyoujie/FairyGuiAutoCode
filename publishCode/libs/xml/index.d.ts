export function parse(xmlStr:string):XML;
    /**
     * The XMLNode class is the base class for all xml node.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * XML节点基类
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    interface XMLNode {
        /**
         * a integer representing the type of the node, 1：XML，2：XMLAttribute，3：XMLText
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 节点类型，1：XML，2：XMLAttribute，3：XMLText
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        nodeType: number;
        /**
         * the parent node of this xml node.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 节点所属的父级节点
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        parent: XML;
    }
    /**
     * The XML class contains properties for working with XML objects.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/utils/XML.ts
     * @language en_US
     */
    /**
     * XML 类包含用于处理 XML 对象的属性。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/utils/XML.ts
     * @language zh_CN
     */
    interface XML extends XMLNode {
        /**
         * the attributes of this xml node.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 当前节点上的属性列表
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        attributes: any;
        /**
         * the children of the xml node.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 当前节点的子节点列表
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        children: XMLNode[];
        /**
         * the full name of this xml node. For example,the name of <s:Button/> is "s:Button".
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 节点完整名称。例如节点 <s:Button/> 的 name 为："s:Button"
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        name: string;
        /**
         * thie namesapce prefix of this xml node.For example,the prefix of <s:Button/> is "s".
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 节点的命名空间前缀。例如节点 <s:Button/> 的 prefix 为：s
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        prefix: string;
        /**
         * the local name of this xml node. For example,the local name of <s:Button/> is "Button".
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 节点的本地名称。例如节点 <s:Button/> 的 localName 为：Button
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        localName: string;
        /**
         * the namesapce uri of this xml node.For example,the namespace uri of <s:Skin xmlns:s="http://ns.egret.com/eui"/> is "http://ns.egret.com/eui".
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 节点的命名空间地址。例如节点 <s:Skin xmlns:s="http://ns.egret.com/eui"/> 的 namespace 为： http://ns.egret.com/eui
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        namespace: string;
    }
    /**
     * The XMLText class represents a string node in the XML.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * XMLText 类表示在XML中的文本节点
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    interface XMLText extends XMLNode {
        /**
         * the text content
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 文本内容
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        text: string;
    }
    