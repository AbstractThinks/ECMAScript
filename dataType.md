<ul>
  <li>
    <h4>Number(数字)</h4>
    <pre>
      JavaScript 不区分整数值和浮点数值，所有数字在 JavaScript 中均用浮点数值表示，所以在进行数字运算的时候要特别注意
      
      0.1 + 0.2 = 0.30000000000000004
      0.2 + 0.2 = 0.4
      0.2 + 0.4 = 0.6000000000000001
      
      在非构造器上下文中 (如：没有 new 操作符)，Number 能被用来执行类型转换。
      var b = new Number("1")
      b       //{[[PrimitiveValue]]: 1}
      var a = Number("1")
      a       //1
    </pre>
  </li>
  <li>
    <h4>String(字符串)</h4>
    <pre> 
      String为构造函数方法
      
      var a = new String('aaaa')
      typeof a    //"object"
      a           //{0: "a", 1: "a", 2: "a", 3: "a", length: 4, [[PrimitiveValue]]: "aaaa"}
      
      var b = String("b")等同于var b = "b"
      typeof b    //"string"
      b           //"b"
    </pre>
  </li>
  <li>
    <h4>Boolean(布尔)</h4>
    <pre>
      1.false、0、空字符串("")、NaN、null 和 undefined 被转换为 false
      2.所有其他值被转换为 true
    </pre>
  </li>
  <li>
    <h4>Symbol(符号)</h4>
  </li>
  <li>
    <h4>Object(对象)</h4>
    <ul>
      <li>
        <h5>Function(函数)</h5>
      </li>
      <li>
        <h5>Array(数组)</h5>
      </li>
      <li>
        <h5>Date(日期)</h5>
      </li>
      <li>
        <h5>RegExp(正则表达式)</h5>
      </li>
    </ul>
  </li>
  <li>
    <h4>Null(空)</h4>
  </li>
  <li>
    <h4>Undefined(未定义)</h4>
  </li>
</ul>
