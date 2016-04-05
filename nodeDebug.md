<a href="https://github.com/node-inspector/node-inspector">node-inspector</a> 

<ul>
  <li>node --debug app.js</li>
  <li>接着再打开一个命令窗口，执行命令“node-inspector &”</li>
  <li>使用浏览器打开<b>执行命令“node-inspector &”所提供的地址</b>，浏览器需要是Chrome</li>
</ul>


<table>
  <caption>node.js原生调试命令</caption>
  <tbody>
  
    <tr>
      <td>命令</td>
      <td>功能</td>
    </tr>
    
    <tr>
      <td>run</td>
      <td>
        <pre>执行脚本,在第一行暂停</pre>
      </td>
    </tr>
    
    <tr>
      <td>restart</td>
      <td>
        <pre>重新执行脚本</pre>
      </td>
    </tr>
    
    <tr>
      <td>cont, c</td>
      <td>
        <pre>继续执行,直到遇到下一个断点</pre>
      </td>
    </tr>
    
    <tr>
      <td>next, n</td>
      <td>
        <pre>单步执行</pre>
      </td>
    </tr>
    
    <tr>
      <td>step, s</td>
      <td>
        <p>单步执行并进入函数</p>
      </td>
    </tr>
    
    <tr>
      <td>out, o</td>
      <td>
        <p><span>从函数中步出</span></p>
      </td>
    </tr>
    
    <tr>
      <td>setBreakpoint(), sb()</td>
      <td>
        <p>当前行设置断点</p>
      </td>
    </tr>
    
    <tr>
      <td>
        <pre>setBreakpoint(‘f()’), sb(...)</pre>
      </td>
      <td>在函数f的第一行设置断点</td>
    </tr>
    
    <tr>
      <td>
        <pre>setBreakpoint(‘script.js’, 20), sb(...)</pre>
      </td>
      <td>在&nbsp;script.js&nbsp;的第20行设置断点</td>
    </tr>
    
    <tr>
      <td>
        <pre>clearBreakpoint, cb(...)</pre>
      </td>
      <td>清除所有断点</td>
    </tr>
    
    <tr>
      <td>
        <pre>backtrace, bt</pre>
      </td>
      <td>显示当前的调用栈</td>
    </tr>
    
    <tr>
      <td>
        <pre>list(5)</pre>
      </td>
      <td>显示当前执行到的前后5行代码</td>
    </tr>
    
    <tr>
      <td>
        <pre>watch(expr)</pre>
      </td>
      <td>把表达式&nbsp;expr&nbsp;加入监视列表</td>
    </tr>
    
    <tr>
      <td>
        <pre>unwatch(expr)</pre>
      </td>
      <td>&nbsp;把表达式&nbsp;expr&nbsp;从监视列表移除&nbsp;</td>
    </tr>
    
    <tr>
      <td>
        <pre>watchers</pre>
      </td>
      <td>显示监视列表中所有的表达式和值</td>
    </tr>
    
    <tr>
      <td>
        <pre>repl</pre>
      </td>
      <td>在当前上下文打开即时求值环境</td>
    </tr>
    
    <tr>
      <td>
        <pre>kill</pre>
      </td>
      <td>终止当前执行的脚本</td>
    </tr>
    
    <tr>
      <td>
        <pre>scripts</pre>
      </td>
      <td>显示当前已加载的所有脚本</td>
    </tr>
    
    <tr>
      <td>
        <pre>version</pre>
      </td>
      <td>显示v8版本</td>
    </tr>
    
  </tbody>
</table>
















<a href="http://cnodejs.org/topic/522030c6bee8d3cb1223255d">参考</a>
