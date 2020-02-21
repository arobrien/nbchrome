/*! view_notebook.js | BSD3 License | Copyright Andrew O'Brien */
'use strict';

console.log("rendering document using nbchrome");

var renderer = require('./notebook_renderer.js');

// require('./mathjax_config.js');
// require('mathjax/es5/tex-chtml.js');

// get and parse json
var p = document.body.getElementsByTagName('pre')[0];
var j = JSON.parse(p.innerText);

// build new dom

var new_dom = renderer.render_notebook(j);

// replace old dom with new dom
document.body.removeChild(p);
document.body.appendChild(new_dom);

// format any math present
// MathJax.typesetPromise()

console.log("nbchrome render completed");
