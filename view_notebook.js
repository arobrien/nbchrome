'use strict';

console.log("nb_chrome loading");


// load in styles and scripts`

var node = document.createElement('style');
node.setAttribute('src', "https://cdnjs.cloudflare.com/ajax/libs/require.js/2.1.10/require.min.js");
document.head.appendChild(node);

var node = document.createElement('style');
node.setAttribute('src', "https://cdnjs.cloudflare.com/ajax/libs/jquery/2.0.3/jquery.min.js");
document.head.appendChild(node);

var node = document.createElement('style');
node.setAttribute('type', 'text/css');
node.innerHTML = style1
document.head.appendChild(node);

var node = document.createElement('style');
node.setAttribute('type', 'text/css');
node.innerHTML = style2
document.head.appendChild(node);

var node = document.createElement('style');
node.setAttribute('type', 'text/css');
node.innerHTML = style3
document.head.appendChild(node);

var node = document.createElement('script');
node.setAttribute('src', "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/latest.js?config=TeX-AMS_HTML");
document.head.appendChild(node);

var node = document.createElement('script');
node.setAttribute('type', "text/x-mathjax-config");
node.setAttribute('src', chrome.runtime.getURL('mathjax_config.js'));
document.head.appendChild(node);

// modify content

function render_cell(cell) {
  if (cell.cell_type == 'code') {
    return render_code_cell(cell);
  }
  else if (cell.cell_type == 'markdown') {
    return render_markdown_cell(cell);
  }
  else {
    return render_dummy_cell(cell);
  }
}

function render_code_cell(cell) {
  var div = document.createElement('div');
  div.setAttribute('class', 'cell border-box-sizing code_cell rendered');
  
  var input = document.createElement('div');
  input.setAttribute('class', 'input');
  div.appendChild(input);
  
  var input_prompt = document.createElement('div');
  input_prompt.setAttribute('class', 'prompt input_prompt');
  input_prompt.innerHTML = 'In&nbsp;[' + (cell.execution_count || '') + ']:'
  input.appendChild(input_prompt);
  
  var inner_cell = document.createElement('div');
  inner_cell.setAttribute('class', 'inner_cell');
  input.appendChild(inner_cell);
  
  var input_area = document.createElement('div');
  input_area.setAttribute('class', 'input_area');
  inner_cell.appendChild(input_area);
  
  var highlight = document.createElement('div');
  highlight.setAttribute('class', 'highlight hl-ipython3');
  input_area.appendChild(highlight);
  
  var pre = document.createElement('pre');
  pre.innerText = cell.source.join('');
  // for (var i=0; i < cell.source.length; i++) {
    // var s = document.createElement('span');
    // s.innerText = cell.source[i];
    // pre.appendChild(s);
  // }
  
  highlight.appendChild(pre);
  
  if (cell.outputs.length > 0) {
    var output_wrapper = document.createElement('div');
    output_wrapper.setAttribute('class', 'output_wrapper');
    div.appendChild(output_wrapper)
    
    var output = document.createElement('div');
    output.setAttribute('class', 'output');
    output_wrapper.appendChild(output)
    
    for (var a=0; a < cell.outputs.length; a++) {
      var output_area = document.createElement('div');
      output_area.setAttribute('class', 'output_area');
      output.appendChild(output_area)
      
      if ('execution_count' in cell.outputs[a]) {
        var output_prompt = document.createElement('div');
        output_prompt.setAttribute('class', 'prompt output_prompt');
        input_prompt.innerHTML = 'Out[' + cell.outputs[a].execution_count + ']:';
        output_area.appendChild(output_prompt);
      }
      else {
        var output_prompt = document.createElement('div');
        output_prompt.setAttribute('class', 'prompt');
        output_area.appendChild(output_prompt);
      }
      
      if (cell.outputs[a].output_type == 'execute_result') {
        if ('text/html' in cell.outputs[a].data) { 
          var output_html = document.createElement('div');
          output_html.setAttribute('class', 'output_html rendered_html output_subarea output_execute_result');
          output_html.innerHTML = cell.outputs[a].data['text/html'].join('');
          output_area.appendChild(output_html);
        }
        else if ('text/plain' in cell.outputs[a].data) {
          var output_text = document.createElement('div');
          output_text.setAttribute('class', 'output_text output_subarea output_execute_result');
          var pre = document.createElement('pre');
          pre.innerText = cell.outputs[a].data['text/plain'].join('');
          output_text.appendChild(pre);
          output_area.appendChild(output_text);
        }
      }
      else if (cell.outputs[a].output_type == 'display_data') {
        if ('image/png' in cell.outputs[a].data) {
          var output_png = document.createElement('div');
          output_png.setAttribute('class', 'output_png output_subarea');
          var img = document.createElement('img');
          img.setAttribute('src', 'data:image/png;base64,' + cell.outputs[a].data['image/png']);
          output_png.appendChild(img);
          output_area.appendChild(output_png);
        }
        else if ('text/plain' in cell.outputs[a].data) {
          var output_text = document.createElement('div');
          output_text.setAttribute('class', 'output_text output_subarea output_execute_result');
          var pre = document.createElement('pre');
          pre.innerText = cell.outputs[a].data['text/plain'].join('');
          output_text.appendChild(pre);
          output_area.appendChild(output_text);
        }
      }
      else if (cell.outputs[a].output_type == 'stream') {
        var output_text = document.createElement('div');
        output_text.setAttribute('class', 'output_subarea output_stream output_stdout output_text');
        var pre = document.createElement('pre');
        pre.innerText = cell.outputs[a].text.join('');
        output_text.appendChild(pre);
        output_area.appendChild(output_text);
      }
    }
  }
  
  return div;
}

function render_markdown_cell(cell) {
  var div = document.createElement('div');
  div.setAttribute('class', 'cell border-box-sizing text_cell rendered');
  
  var input_prompt = document.createElement('div');
  input_prompt.setAttribute('class', 'prompt input_prompt');
  div.appendChild(input_prompt);
  
  var inner_cell = document.createElement('div');
  inner_cell.setAttribute('class', 'inner_cell');
  div.appendChild(inner_cell);
  
  var text_div = document.createElement('div');
  text_div.setAttribute('class', 'text_cell_render border-box-sizing rendered_html');
  
  var markdown_source = cell.source.join('');
  var converter = new showdown.Converter();
  var markdown_html = converter.makeHtml(markdown_source);
  text_div.innerHTML = markdown_html
  
  inner_cell.appendChild(text_div);
  
  return div;
}

function render_dummy_cell(cell) {
  var div = document.createElement('div');
  div.innerHTML = 'Cell type ' + cell.cell_type + ' not supported';
  return div;
}


var maindiv = document.createElement('div');
maindiv.setAttribute('tabindex', '-1');
maindiv.setAttribute('id', 'notebook');
maindiv.setAttribute('class', 'border-box-sizing');

var containerdiv = document.createElement('div');
containerdiv.setAttribute('id', 'notebook-container');
containerdiv.setAttribute('class', 'container');


// get and parse json
var p = document.body.getElementsByTagName('pre')[0];
var j = JSON.parse(p.innerText);

for (var i=0; i < j.cells.length; i++) {
  containerdiv.appendChild(render_cell(j.cells[i]));
}

maindiv.appendChild(containerdiv);

document.body.removeChild(p);
document.body.appendChild(maindiv);

console.log("nb_chrome loaded");
