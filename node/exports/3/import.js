 var x = require('./export.js');
 console.log(x) //{ [Function: a] test1: [Function] }
 console.log(x.test) //undefined
 console.log(x.test1) //[Function]
 x.test1() //test1