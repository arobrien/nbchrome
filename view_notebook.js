/*! view_notebook.js | BSD3 License | Copyright Andrew O'Brien */
'use strict';

console.log("nbchrome loading");

function make_node(tag, attributes, innerText, innerHTML) {
  var node = document.createElement(tag);
  for (var a in attributes) {
    node.setAttribute(a, attributes[a]);
  }
  if (innerText) {
    node.innerText = innerText;
  }
  if (innerHTML) {
    node.innerHTML = innerHTML;
  }
  return node;
}


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
  var div = make_node('div', {class: 'cell border-box-sizing code_cell rendered'});
  
  div.appendChild(make_code_input_div(cell));
  
  if (cell.outputs.length > 0) {
    div.appendChild(make_code_output_div(cell));
  }
  
  return div;
}

function render_markdown_cell(cell) {
  var converter = new showdown.Converter();
  var markdown_html = converter.makeHtml(cell.source.join(''));
  
  var div = make_node('div', {class: 'cell border-box-sizing text_cell rendered'});
  div.appendChild(
    make_node('div', {class: 'prompt input_prompt'}));
  div.appendChild(
    make_node('div', {class: 'inner_cell'})).appendChild(
    make_node('div', {class: 'text_cell_render border-box-sizing rendered_html'}, undefined, markdown_html));
  
  return div;
}

function render_dummy_cell(cell) {
  return make_node('div', {}, undefined, 'Cell type ' + cell.cell_type + ' not supported');
}

function make_code_input_div(cell) {
  var code = make_node('code', {class: 'python'}, cell.source.join(''));
  hljs.highlightBlock(code);
  
  var input = make_node('div', {class: 'input'});

  input.appendChild(
    make_node('div', {class: 'prompt input_prompt'}, undefined, 'In&nbsp;[' + (cell.execution_count || '') + ']:'));
  
  input.appendChild(
    make_node('div', {class: 'inner_cell'})).appendChild(
    make_node('div', {class: 'input_area'})).appendChild(
    make_node('div', {class: 'highlight'})).appendChild(
    make_node('pre')).appendChild(
    code)
  
  return input;
}

function make_code_output_div(cell) {
  var output_wrapper = make_node('div', {class: 'output_wrapper'});
  
  var output_div = make_node('div', {class: 'output'});
  output_wrapper.appendChild(output_div)
  
  for (var output of cell.outputs) {
    output_div.appendChild(make_output_area(output));
  }
  
  return output_wrapper;
}

function make_output_area(output) {
  var output_area = make_node('div', {class: 'output_area'});
  
  if ('execution_count' in output) {
    output_area.appendChild(make_node('div', {class: 'prompt output_prompt'}, undefined, 'Out[' + output.execution_count + ']:'));
  }
  else {
    output_area.appendChild(make_node('div', {class: 'prompt'}));
  }
  
  if (output.output_type == 'execute_result') {
    if ('text/html' in output.data) { 
      output_area.appendChild(make_html_output(output));
    }
    else if ('text/plain' in output.data) {
      output_area.appendChild(make_text_output(output));
    }
  }
  else if (output.output_type == 'display_data') {
    if ('image/png' in output.data) {
      output_area.appendChild(make_image_output(output));
    }
    else if ('text/plain' in output.data) {
      output_area.appendChild(make_text_output(output));
    }
  }
  else if (output.output_type == 'stream') {
    output_area.appendChild(make_stream_output(output));
  }
  
  return output_area;
}

function make_html_output(output) {
  return make_node('div', {class: 'output_html rendered_html output_subarea output_execute_result'}, undefined, output.data['text/html'].join(''));
}

function make_text_output(output) {
  var output_text = make_node('div', {class: 'output_text output_subarea output_execute_result'});
  output_text.appendChild(make_node('pre', {}, output.data['text/plain'].join('')));
  return output_text;
}

function make_image_output(output) {
  var output_png = make_node('div', {class: 'output_png output_subarea'});
  output_png.appendChild(make_node('img', {src: 'data:image/png;base64,' + output.data['image/png']}));
  return output_png;
}

function make_stream_output(output) {
  var output_text = make_node('div', {class: 'output_subarea output_stream output_stdout output_text'});
  output_text.appendChild(make_node('pre', {}, undefined, output.text.join('')));
  return output_text;
}

// get and parse json
var p = document.body.getElementsByTagName('pre')[0];
var j = JSON.parse(p.innerText);

// build new dom
var containerdiv = make_node('div', {id: 'notebook-container', class: 'container'});
for (var cell of j.cells) {
  containerdiv.appendChild(render_cell(cell));
}

// replace old dom with new dom
document.body.removeChild(p);
document.body.appendChild(make_node('div', {tabindex: '-1', id: 'notebook', class: 'border-box-sizing'}).appendChild(containerdiv));

// format any math present
MathJax.typesetPromise()

console.log("nbchrome loaded");
