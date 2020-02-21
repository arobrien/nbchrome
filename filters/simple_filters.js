const showdown = require('showdown');
const hljs = require('highlightjs');

module.exports = {
  filter_data_type: filter_data_type,
  get_metadata: get_metadata,
  highlight_code: highlight_code,
  json_dumps: json_dumps,
  markdown2html: markdown2html,
  posix_path: posix_path,
  strip_files_prefix: strip_files_prefix
};


DISPLAY_DATA_PRIORITY = [
  'text/html',
  'application/pdf',
  'text/latex', 
  'image/svg+xml', 
  'image/png',
  'image/jpeg', 
  'text/markdown', 
  'text/plain'
];

function filter_data_type(output) {
  for (fmt of DISPLAY_DATA_PRIORITY) {
    if (output.hasOwnProperty(fmt)) return [fmt];
  }
  // TODO: handle warning
  return [undefined];
}

function get_metadata(output, key, mimetype=undefined) {
  // from nbconvert/filters/metadata.py
  // Resolve an output metadata key  
  // If mimetype given, resolve at mimetype level first,
  // then fallback to top-level.
  // Otherwise, just resolve at top-level.
  // Returns None if no data found.
  const md = output.metadata;
  if (mimetype &&
      md.hasOwnProperty(mimetype) && 
      md[mimetype] != undefined &&
      md[mimetype].hasOwnProperty(key) && 
      md[mimetype][key] != undefined) {
    return md[mimetype][key];
  }
  return md[key];
}

function highlight_code(source) {
  return hljs.highlight(window.notebook_language, source.join(''), true).value;
}

function json_dumps(obj) {
  return JSON.stringify(obj);
}

function markdown2html(source) {
  const converter = new showdown.Converter();
  return converter.makeHtml(source.join(''));
}

function posix_path(path) {
  return path.replace(/\\/g,'/');
}

function strip_files_prefix(dirty_text) {
  // Fix all fake URLs that start with `files/`, stripping out the `files/` prefix.
  //  Applies to both urls (for html) and relative paths (for markdown paths).
  return dirty_text.replace(/(src|href)\=([\'"]?)\/?files\//g, (m,p1,p2) => p1 + '=' + p2).replace(
                            /(!?)\[(.*?)\]\(\/?files\/(.*?)\)/g, (m,p1,p2,p3) => p1 + '[' + p2 + '](' + p3 + ')');
}



