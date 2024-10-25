// test.js
// (c) tearflake, 2024
// MIT License

"use strict";

var Sexpression = require ("./src/sexpression.js");
var output = Sexpression.parse ('(a b c)');
console.log (JSON.stringify (output, null, 4));


