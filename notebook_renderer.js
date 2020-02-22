/*! view_notebook.js | BSD3 License | Copyright Andrew O'Brien */
'use strict';

const simple_filters = require('./filters/simple_filters.js');
const ansi = require('./filters/ansi.js');


module.exports = {
  render_notebook: render_notebook
}

function make_node(tag, attributes, innerHTML) {
  var node = document.createElement(tag);
  for (var a in attributes) {
    node.setAttribute(a, attributes[a]);
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
  var markdown_html = simple_filters.markdown2html(cell.source);
  
  var div = make_node('div', {class: 'cell border-box-sizing text_cell rendered'});
  div.appendChild(
    make_node('div', {class: 'prompt input_prompt'}));
  div.appendChild(
    make_node('div', {class: 'inner_cell'})).appendChild(
    make_node('div', {class: 'text_cell_render border-box-sizing rendered_html'}, markdown_html));
  
  return div;
}

function render_dummy_cell(cell) {
  return make_node('div', {}, 'Cell type ' + cell.cell_type + ' not supported');
}

function make_code_input_div(cell) {
  var highlight_code = simple_filters.highlight_code(cell.source);
  
  var code = make_node('code', {class: 'python'}, highlight_code);
  
  var input = make_node('div', {class: 'input'});

  input.appendChild(
    make_node('div', {class: 'prompt input_prompt'}, 'In&nbsp;[' + (cell.execution_count || '') + ']:'));
  
  input.appendChild(
    make_node('div', {class: 'inner_cell'})).appendChild(
    make_node('div', {class: 'input_area'})).appendChild(
    make_node('div', {class: 'highlight hljs'})).appendChild(
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
    output_area.appendChild(make_node('div', {class: 'prompt output_prompt'}, 'Out[' + output.execution_count + ']:'));
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
  return make_node('div', {class: 'output_html rendered_html output_subarea output_execute_result'}, output.data['text/html'].join(''));
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
  output_text.appendChild(make_node('pre', {}, output.text.join('')));
  return output_text;
}

function render_notebook(j) {
  var j;

  window.notebook_language = j.metadata.kernelspec.language;

  var containerdiv = make_node('div', {id: 'notebook-container', class: 'container'});
  for (var cell of j.cells) {
    containerdiv.appendChild(render_cell(cell));
  }

  var notebook_div = make_node('div', {tabindex: '-1', id: 'notebook', class: 'border-box-sizing'});
  notebook_div.appendChild(containerdiv);

  return notebook_div;
}
