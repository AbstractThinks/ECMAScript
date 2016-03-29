<img src="./img/5.jpg"/>



1）浏览器会解析三个东西：

    一个是HTML/SVG/XHTML，事实上，Webkit有三个C++的类对应这三类文档。解析这三种文件会产生一个DOM Tree。

    CSS，解析CSS会产生CSS规则树。

    Javascript，脚本，主要是通过DOM API和CSSOM API来操作DOM Tree和CSS Rule Tree.
    
2）解析完成后，浏览器引擎会通过DOM Tree 和 CSS Rule Tree 来构造 Rendering Tree。注意：

    Rendering Tree 渲染树并不等同于DOM树，因为一些像Header或display:none的东西就没必要放在渲染树中了。

    CSS 的 Rule Tree主要是为了完成匹配并把CSS Rule附加上Rendering Tree上的每个Element。也就是DOM结点。也就是所谓的Frame。

    然后，计算每个Frame（也就是每个Element）的位置，这又叫layout和reflow过程。
     
3）最后通过调用操作系统Native GUI的API绘制。




<a href="https://www.zhihu.com/question/20117417" target="_blank">参考</a>
